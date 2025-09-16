import { BackendError, parseOrThrow, type PromotionJobName, type RequestService, RequestStatus, unwrapOrThrow } from '@aromi/shared'
import type { SomeRequestRow, SomeRequestVoteCountRow, SomeRequestVoteRow } from '@aromi/shared/src/db/features/requests/types.js'
import { errAsync, okAsync, type ResultAsync } from 'neverthrow'
import { ACCEPTED_VOTE_COUNT_THRESHOLD } from '../types.js'
import { VoteOnRequestSchema } from '../utils/validation.js'
import type { RequestResolverParams } from '@src/resolvers/RequestResolver.js'
import { RequestMutationResolver } from './RequestMutationResolver.js'
import type { ResolverReturn } from '@src/utils/types.js'

interface VoteOnRequestArgs {
  input: {
    requestId: string
    vote: number
  }
}

export interface VoteOnRequestParams<TResolver, R extends SomeRequestRow> extends RequestResolverParams<TResolver, VoteOnRequestArgs> {
  service: RequestService<R>
  jobName: PromotionJobName
}

export abstract class VoteOnRequestResolver<
  TResolver,
  R extends SomeRequestRow
> extends RequestMutationResolver<TResolver, VoteOnRequestArgs> {
  protected readonly initialService: RequestService<R>
  protected readonly jobName: PromotionJobName
  protected trxService?: RequestService

  constructor (
    params: VoteOnRequestParams<TResolver, R>
  ) {
    super(params)
    this.initialService = params.service
    this.jobName = params.jobName
  }

  abstract mapToOutput (request: R): ResolverReturn<TResolver>

  resolve (): ResultAsync<ResolverReturn<TResolver>, BackendError> {
    const { initialService } = this

    if (this.trxService != null) {
      return errAsync(
        new BackendError(
          'ALREADY_INITIALIZED',
          'Transaction service already initialized',
          500
        )
      )
    }

    return initialService
      .withTransactionAsync(async trx => {
        this.trxService = trx as unknown as RequestService
        return await this.handleVote()
      })
      .andThrough(({ request, voteCounts }) => {
        if (!this.shouldPromote(voteCounts, request)) return okAsync()
        return this.handlePromotion(request)
      })
      .map(({ request }) => this.mapToOutput(request as R))
  }

  protected async handleVote () {
    if (this.trxService == null) {
      throw new BackendError(
        'NOT_INITIALIZED',
        'Transaction service not initialized',
        500
      )
    }

    const { input } = this.args
    parseOrThrow(VoteOnRequestSchema, input)

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

  protected handlePromotion (request: SomeRequestRow) {
    const { queues } = this.context
    const { promotions } = queues

    const jobName = this.jobName
    const data = { requestId: request.id }

    return promotions.enqueue({ jobName, data })
  }

  protected async getRequest (): Promise<SomeRequestRow> {
    const { requestId } = this.args.input

    const request = await unwrapOrThrow(
      this
        .trxService!
        .findOne(
          eb => eb('id', '=', requestId)
        )
        .andThen(request => this.authorizeEdit(request))
    )

    return request
  }

  protected async getExistingVote (): Promise<SomeRequestVoteRow | null> {
    const { me, args } = this
    const { requestId } = args.input

    const userId = me.id

    const existingVote = await unwrapOrThrow(
      this
        .trxService!
        .votes
        .findOne(
          eb => eb.and([
            eb('requestId', '=', requestId),
            eb('userId', '=', userId)
          ])
        )
        .orElse(error => {
          if (error.status === 404) return okAsync(null)
          return errAsync(error)
        })
    )

    return existingVote
  }

  protected async insertVote (): Promise<SomeRequestVoteRow> {
    const { me, args } = this

    const { requestId, vote } = args.input
    const userId = me.id

    const inserted = await unwrapOrThrow(
      this
        .trxService!
        .votes
        .createOne({ requestId, userId, vote })
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

  protected async updateVote (
    oldVote: number
  ): Promise<SomeRequestVoteRow> {
    const { me, args } = this

    const { requestId, vote } = args.input
    const userId = me.id

    const updatedVote = await unwrapOrThrow(
      this
        .trxService!
        .votes
        .updateOne(
          eb => eb.and([
            eb('requestId', '=', requestId),
            eb('userId', '=', userId)
          ]),
          { vote }
        )
    )

    const deltaUp = (vote === 1 ? 1 : 0) - (oldVote === 1 ? 1 : 0)
    const deltaDown = (vote === -1 ? 1 : 0) - (oldVote === -1 ? 1 : 0)

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

    return updatedVote
  }

  protected async getVoteCount (): Promise<SomeRequestVoteCountRow> {
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

  protected shouldPromote (
    voteCounts: SomeRequestVoteCountRow,
    request: SomeRequestRow
  ): boolean {
    return (
      voteCounts.upvotes >= ACCEPTED_VOTE_COUNT_THRESHOLD &&
      request.requestStatus === RequestStatus.PENDING
    )
  }

  protected override isRequestEditable (request: SomeRequestRow): boolean {
    return true
  }
}