import { AGGREGATION_JOB_NAMES, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { VoteOnFragranceInputSchema } from '../utils/validation.js'
import { mapFragranceRowToFragranceSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['voteOnFragrance']

export class VoteOnFragranceResolver extends MutationResolver<Mutation> {
  async resolve () {
    const { input } = this.args
    parseOrThrow(VoteOnFragranceInputSchema, input)

    const fragrance = await unwrapOrThrow(this.getFragrance())

    await unwrapOrThrow(this.upsertVote())
    await this.enqueueAggregation()

    return mapFragranceRowToFragranceSummary(fragrance)
  }

  private enqueueAggregation () {
    const { fragranceId } = this.args.input
    const { queues } = this.context

    const { aggregations } = queues

    return aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_VOTES,
        data: { fragranceId }
      })
  }

  private getFragrance () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId } = input
    const { fragrances } = services

    return fragrances
      .findOne(
        eb => eb('id', '=', fragranceId)
      )
  }

  private upsertVote () {
    const { me, args, context } = this
    const { services } = context

    const { fragranceId, vote } = args.input
    const userId = me.id

    const { fragrances } = services

    return fragrances
      .votes
      .upsert(
        { fragranceId, userId, vote },
        oc => oc
          .columns(['fragranceId', 'userId'])
          .doUpdateSet({ vote })
      )
  }
}