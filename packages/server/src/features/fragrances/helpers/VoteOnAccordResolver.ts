import { unwrapOrThrow, INDEXATION_JOB_NAMES, AGGREGATION_JOB_NAMES, parseOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { GenericVoteOnEntityInputSchema } from '@src/utils/validation.js'

type Mutation = MutationResolvers['voteOnFragranceAccord']

export class VoteOnAccordResolver extends MutationResolver<Mutation> {
  async resolve () {
    const { input } = this.args
    parseOrThrow(GenericVoteOnEntityInputSchema, input)

    const accord = await unwrapOrThrow(this.getAccord())

    await unwrapOrThrow(this.upsertVote())
    await this.enqueueIndex()
    await this.enqueueAggregation()

    return accord
  }

  private enqueueIndex () {
    const { context, args } = this
    const { queues } = context

    const { fragranceId } = args.input

    return queues
      .indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        data: { fragranceId }
      })
  }

  private enqueueAggregation () {
    const { context, args } = this
    const { queues } = context

    const { fragranceId, accordId } = args.input

    return queues
      .aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES,
        data: { fragranceId, accordId }
      })
  }

  private upsertVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, accordId, vote } = input
    const userId = me.id

    const { fragrances } = services

    return fragrances
      .accords
      .votes
      .upsert(
        { fragranceId, userId, accordId },
        oc => oc
          .columns(['fragranceId', 'userId', 'accordId'])
          .doUpdateSet({ vote })
      )
  }

  private getAccord () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { accordId } = input
    const { accords } = services

    return accords
      .findOne(
        eb => eb('id', '=', accordId)
      )
  }
}