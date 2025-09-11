import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { type FragranceRequestRow, type FragranceRequestVoteCountRow, parseSchema, unwrapOrThrow } from '@aromi/shared'
import { errAsync, okAsync } from 'neverthrow'
import type { InsertVoteParams, UpdateVoteParams } from '../types.js'
import { ACCEPTED_VOTE_COUNT_THRESHOLD } from '@src/features/requests/types.js'
import { VoteOnRequestSchema } from '@src/features/requests/utils/validation.js'

export class FragranceRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnFragranceRequest: MutationResolvers['voteOnFragranceRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services, queues } = context
    const me = this.checkAuthenticated(context)

    const { requestId } = input
    const { vote } = parseSchema(VoteOnRequestSchema, input)
    const { fragranceRequests } = services

    const { request, voteCounts }= await unwrapOrThrow(fragranceRequests
      .withTransactionAsync(async trx => {
        const request = await unwrapOrThrow(
          trx.findOne(eb => eb('id', '=', requestId))
        )

        const existing = await unwrapOrThrow(
          trx
            .votes
            .findOne(
              eb => eb.and([
                eb('userId', '=', me.id),
                eb('requestId', '=', requestId)
              ])
            )
            .orElse(error => {
              if (error.status === 404) return okAsync(null)
              return errAsync(error)
            })
        )

        if (existing == null) {
          await this
            .insertVote({
              trx,
              userId: me.id,
              requestId,
              vote
            })
        } else if (existing.vote !== vote) {
          await this
            .updateVote({
              trx,
              userId: me.id,
              requestId,
              oldVote: existing.vote,
              newVote: vote
            })
        }

        const voteCounts = await unwrapOrThrow(
          trx
            .votes
            .counts
            .findOne(
              eb => eb('requestId', '=', requestId)
            )
        )

        return { request, voteCounts }
      })
    )

    if (this.shouldPromote(voteCounts, request)) {
      await unwrapOrThrow(
        queues
          .promotions
          .enqueue({ jobName: 'promote-fragrance', data: request })
      )
    }

    return mapFragranceRequestRowToFragranceRequest(request)
  }

  private async insertVote (params: InsertVoteParams) {
    const { trx, userId, requestId, vote } = params

    await unwrapOrThrow(
      trx
        .votes
        .createOne({ userId, requestId, vote })
    )

    if (vote === 0) {
      return null
    }

    const column = vote === 1 ? 'upvotes' : 'downvotes'

    return await unwrapOrThrow(
      trx
        .votes
        .counts
        .updateOne(
          eb => eb('requestId', '=', requestId),
          eb => ({ [column]: eb(column, '+', 1) })
        )
    )
  }

  private async updateVote (params: UpdateVoteParams) {
    const { trx, userId, requestId, oldVote, newVote } = params

    await unwrapOrThrow(
      trx
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
      return await unwrapOrThrow(
        trx
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

    return null
  }

  private shouldPromote (
    voteCounts: FragranceRequestVoteCountRow,
    request: FragranceRequestRow
  ) {
    return (
      voteCounts.upvotes >= ACCEPTED_VOTE_COUNT_THRESHOLD &&
      request.requestStatus === 'PENDING'
    )
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnFragranceRequest: this.voteOnFragranceRequest
    }
  }
}
