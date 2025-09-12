import { BackendError, type NoteRequestRow, type NoteRequestService, type NoteRequestVoteCountRow, type NoteRequestVoteRow, parseSchema, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { errAsync, okAsync, type ResultAsync } from 'neverthrow'
import { VoteOnRequestSchema } from '@src/features/requests/utils/validation.js'
import { AuthenticatedRequestResolver } from '@src/resolvers/AuthenticatedRequestResolver.js'
import { ACCEPTED_VOTE_COUNT_THRESHOLD } from '@src/features/requests/types.js'
import type { INoteRequestSummary } from '../types.js'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers.js'

export class VoteOnNRResolver extends AuthenticatedRequestResolver<MutationResolvers['voteOnNoteRequest']> {
  private trxService?: NoteRequestService

  resolve (): ResultAsync<INoteRequestSummary, BackendError> {
    const { services } = this.context

    const { noteRequests } = services

    if (this.trxService != null) {
      return errAsync(
        new BackendError(
          'ALREADY_INITIALIZED',
          'Transaction service already initialized',
          500
        )
      )
    }

    return noteRequests
      .withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.handleVote()
      })
      .andThrough(({ request, voteCounts }) => {
        if (!this.shouldPromote(voteCounts, request)) return okAsync()
        return this.handlePromotion(request)
      })
      .map(({ request }) =>
        mapNoteRequestRowToNoteRequestSummary(request)
      )
  }

  private async handleVote () {
    if (this.trxService == null) {
      throw new BackendError(
        'NOT_INITIALIZED',
        'Transaction service not initialized',
        500
      )
    }

    const { input } = this.args
    parseSchema(VoteOnRequestSchema, input)

    const request = await this.getRequest()
    const existingVote = await this.getExistingVote()

    if (existingVote == null) {
      await this.insertVote()
    } else if (existingVote.vote !== input.vote) {
      await this.updateVote(existingVote.vote)
    }

    const voteCounts = await this.getVoteCount()

    return { request, voteCounts }
  }

  private handlePromotion (request: NoteRequestRow) {
    const { queues } = this.context
    const { promotions } = queues

    return promotions.enqueue({ jobName: 'promote-note', data: request })
  }

  private async getRequest (): Promise<NoteRequestRow> {
    const { requestId } = this.args.input

    const request = await unwrapOrThrow(
      this
        .trxService!
        .findOne(
          eb => eb('id', '=', requestId)
        )
    )

    return request
  }

  private async getExistingVote (): Promise<NoteRequestVoteRow | null> {
    const { me, args } = this
    const { requestId } = args.input

    const existing = await unwrapOrThrow(
      this
        .trxService!
        .votes
        .findOne(
          eb => eb.and([
            eb('userId', '=', me.id),
            eb('requestId', '=', requestId)
          ])
        )
        .orElse(error => {
          if (error.status === 404) {
            return okAsync(null)
          }
          return errAsync(error)
        })
    )

    return existing
  }

  private async insertVote (): Promise<NoteRequestVoteRow> {
    const { me, args } = this

    const { requestId, vote } = args.input
    const userId = me.id

    const inserted = await unwrapOrThrow(
      this
        .trxService!
        .votes
        .createOne({ userId, requestId, vote })
    )

    if (vote === 0) {
      return inserted
    }

    const column = vote === 1 ? 'upvotes' : 'downvotes'

    await unwrapOrThrow(
      this
        .trxService!
        .votes
        .counts
        .updateOne(
          eb => eb('requestId', '=', requestId),
          eb => ({ [column]: eb(column, '+', 1) })
        )
    )

    return inserted
  }

  private async updateVote (
    oldVote: number
  ): Promise<NoteRequestVoteRow> {
    const { me, args } = this

    const { requestId, vote: newVote } = args.input
    const userId = me.id

    const updated = await unwrapOrThrow(
      this
        .trxService!
        .votes
        .updateOne(
          eb => eb.and([
            eb('userId', '=', userId),
            eb('requestId', '=', requestId)
          ]),
          { vote: newVote }
        )
    )

    const deltaUp = (newVote === 1 ? 1 : 0) - (oldVote === 1 ? 1 : 0)
    const deltaDown = (newVote === -1 ? 1 : 0) - (oldVote === -1 ? 1 : 0)

    if (deltaUp !== 0 || deltaDown !== 0) {
      await unwrapOrThrow(
        this
          .trxService!
          .votes
          .counts
          .updateOne(
            eb => eb('requestId', '=', requestId),
            eb => ({
              upvotes: eb('upvotes', '+', deltaUp),
              downvotes: eb('downvotes', '+', deltaDown)
            })
          )
      )
    }

    return updated
  }

  private async getVoteCount (): Promise<NoteRequestVoteCountRow> {
    const { requestId } = this.args.input

    const voteCounts = await unwrapOrThrow(
      this
        .trxService!
        .votes
        .counts
        .findOne(
          eb => eb('requestId', '=', requestId)
        )
    )

    return voteCounts
  }

  private shouldPromote (
    voteCounts: NoteRequestVoteCountRow,
    request: NoteRequestRow
  ): boolean {
    return (
      voteCounts.upvotes >= ACCEPTED_VOTE_COUNT_THRESHOLD &&
      request.requestStatus === 'PENDING'
    )
  }
}