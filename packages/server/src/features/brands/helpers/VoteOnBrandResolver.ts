import { AGGREGATION_JOB_NAMES, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { VoteOnBrandInputSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['voteOnBrand']

export class VoteOnBrandResolver extends MutationResolver<Mutation> {
  async resolve () {
    const { input } = this.args
    parseOrThrow(VoteOnBrandInputSchema, input)

    const brand = await unwrapOrThrow(this.getBrand())

    await unwrapOrThrow(this.upsertVote())
    await this.enqueueAggregation()

    return brand
  }

  private enqueueAggregation () {
    const { brandId } = this.args.input
    const { queues } = this.context

    const { aggregations } = queues

    return aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_VOTES,
        data: { brandId }
      })
  }

  private getBrand () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { brandId } = input
    const { brands } = services

    return brands
      .findOne(
        eb => eb('id', '=', brandId)
      )
  }

  private upsertVote () {
    const { me, args, context } = this
    const { services } = context

    const { brandId, vote } = args.input
    const userId = me.id

    const { brands } = services

    return brands
      .votes
      .upsert(
        { brandId, userId, vote },
        oc => oc
          .columns(['brandId', 'userId'])
          .doUpdateSet({ vote })
      )
  }
}