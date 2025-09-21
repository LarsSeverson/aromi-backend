import { PROMOTION_JOB_NAMES, type FragranceRequestRow, RequestStatus, parseOrThrow, unwrapOrThrow, AGGREGATION_JOB_NAMES, type FragranceService, type FragranceRequestScoreRow, RequestType } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { ACCEPTED_VOTE_COUNT_THRESHOLD } from '@src/features/requests/types.js'
import { VoteOnRequestSchema } from '@src/features/requests/utils/validation.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'

type Mutation = MutationResolvers['voteOnFragranceRequest']

export class VoteOnFragranceRequestResolver extends MutationResolver<Mutation> {
  private trxService?: FragranceService

  async resolve () {
    const { context } = this
    const { services } = context
    const { fragrances } = services

    const { request, score } = await unwrapOrThrow(
      fragrances
        .withTransactionAsync(async trx => {
          this.trxService = trx
          return await this.handleVote()
        })
    )

    await this.handleJobs(request, score)

    return mapFragranceRequestRowToFragranceRequest(request)
  }

  private async handleVote () {
    const { input } = this.args
    parseOrThrow(VoteOnRequestSchema, input)

    const request = await unwrapOrThrow(this.getRequest())
    const upserted = await unwrapOrThrow(this.upsertVote())
    const score = await unwrapOrThrow(this.getScore())

    return { request, upserted, score }
  }

  private async handleJobs (
    request: FragranceRequestRow,
    score: FragranceRequestScoreRow
  ) {
    if (this.shouldPromote(request, score)) {
      await this.createJob(request)
      await this.enqueuePromotion()
    }

    return await this.enqueueAggregation()
  }

  private createJob (request: FragranceRequestRow) {
    const { context } = this
    const { services } = context

    const { fragrances } = services

    return fragrances
      .requests
      .jobs
      .createOne({ requestId: request.id, requestType: RequestType.FRAGRANCE })
  }

  private enqueuePromotion () {
    const { requestId } = this.args.input
    const { queues } = this.context

    const { promotions } = queues

    return promotions
      .enqueue({
        jobName: PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE,
        data: { requestId }
      })

  }

  private enqueueAggregation () {
    const { requestId } = this.args.input
    const { queues } = this.context
    const { aggregations } = queues

    return aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REQUEST_VOTES,
        data: { requestId }
      })
  }

  private getRequest () {
    const { requestId } = this.args.input

    return this
      .trxService!
      .requests
      .findOne(eb => eb('id', '=', requestId))
  }

  private getScore () {
    const { requestId } = this.args.input

    return this
      .trxService!
      .requests
      .votes
      .scores
      .findOne(eb => eb('requestId', '=', requestId))
  }

  private upsertVote () {
    const { me, args } = this

    const { requestId, vote } = args.input
    const userId = me.id

    return this
      .trxService!
      .requests
      .votes
      .upsert(
        { requestId, userId, vote },
        oc => oc
          .columns(['requestId', 'userId'])
          .doUpdateSet({ vote })
      )
  }

  private shouldPromote (
    request: FragranceRequestRow,
    score: FragranceRequestScoreRow
  ) {
    return (
      score.score >= ACCEPTED_VOTE_COUNT_THRESHOLD &&
      request.requestStatus === RequestStatus.PENDING
    )
  }
}