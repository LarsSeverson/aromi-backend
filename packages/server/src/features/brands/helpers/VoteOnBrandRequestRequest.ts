import { PROMOTION_JOB_NAMES, type BrandRequestRow, RequestStatus, parseOrThrow, unwrapOrThrow, AGGREGATION_JOB_NAMES, type BrandService, type BrandRequestScoreRow, RequestType } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { ACCEPTED_VOTE_COUNT_THRESHOLD } from '@src/features/requests/types.js'
import { VoteOnRequestSchema } from '@src/features/requests/utils/validation.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['voteOnBrandRequest']

export class VoteOnBrandRequestResolver extends MutationResolver<Mutation> {
  private trxService?: BrandService

  async resolve () {
    const { context } = this
    const { services } = context
    const { brands } = services

    const { request, score } = await unwrapOrThrow(
      brands
        .withTransactionAsync(async trx => {
          this.trxService = trx
          return await this.handleVote()
        })
    )

    await this.handleJobs(request, score)

    return mapBrandRequestRowToBrandRequestSummary(request)
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
    request: BrandRequestRow,
    score: BrandRequestScoreRow
  ) {
    if (this.shouldPromote(request, score)) {
      await this.createJob(request)
      await this.enqueuePromotion()
    }

    return await this.enqueueAggregation()
  }

  private createJob (request: BrandRequestRow) {
    const { context } = this
    const { services } = context

    const { brands } = services

    return brands
      .requests
      .jobs
      .createOne({ requestId: request.id, requestType: RequestType.BRAND })
  }

  private enqueuePromotion () {
    const { requestId } = this.args.input
    const { queues } = this.context
    const { promotions } = queues

    return promotions
      .enqueue({
        jobName: PROMOTION_JOB_NAMES.PROMOTE_BRAND,
        data: { requestId }
      })
  }

  private enqueueAggregation () {
    const { requestId } = this.args.input
    const { queues } = this.context
    const { aggregations } = queues

    return aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_REQUEST_VOTES,
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
    request: BrandRequestRow,
    score: BrandRequestScoreRow
  ) {
    return (
      score.score >= ACCEPTED_VOTE_COUNT_THRESHOLD &&
      request.requestStatus === RequestStatus.PENDING
    )
  }
}