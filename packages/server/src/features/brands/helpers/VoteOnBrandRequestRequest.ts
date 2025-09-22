import { parseOrThrow, unwrapOrThrow, AGGREGATION_JOB_NAMES, type BrandService } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { VoteOnRequestSchema } from '@src/features/requests/utils/validation.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['voteOnBrandRequest']

export class VoteOnBrandRequestResolver extends MutationResolver<Mutation> {
  private trxService?: BrandService

  async resolve () {
    const { context } = this
    const { services } = context
    const { brands } = services

    const { request } = await unwrapOrThrow(
      brands
        .withTransactionAsync(async trx => {
          this.trxService = trx
          return await this.handleVote()
        })
    )

    await this.enqueueAggregation()

    return mapBrandRequestRowToBrandRequestSummary(request)
  }

  private async handleVote () {
    const { input } = this.args
    parseOrThrow(VoteOnRequestSchema, input)

    const request = await unwrapOrThrow(this.getRequest())
    const vote = await unwrapOrThrow(this.upsertVote())

    return { request, vote }
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
}