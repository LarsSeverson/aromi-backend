import { AGGREGATION_JOB_NAMES, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { GenericVoteOnEntityInputSchema } from '@src/utils/validation.js'
import { mapFragranceReviewRowToFragranceReview } from '../utils/mappers.js'

type Mutation = MutationResolvers['voteOnFragranceReview']

export class VoteOnFragranceReviewResolver extends MutationResolver<Mutation> {
  async resolve () {
    const { input } = this.args
    parseOrThrow(GenericVoteOnEntityInputSchema, input)

    const review = await unwrapOrThrow(this.getReview())

    await unwrapOrThrow(this.upsertVote())
    await this.enqueueAggregation()

    return mapFragranceReviewRowToFragranceReview(review)
  }

  private enqueueAggregation () {
    const { reviewId } = this.args.input
    const { queues } = this.context

    const { aggregations } = queues

    return aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_REVIEW_VOTES,
        data: { reviewId }
      })
  }

  private getReview () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { reviewId } = input
    const { fragrances } = services

    return fragrances
      .reviews
      .findOne(
        eb => eb('id', '=', reviewId)
      )
  }

  private upsertVote () {
    const { me, args, context } = this
    const { services } = context

    const { reviewId, vote } = args.input
    const userId = me.id

    const { fragrances } = services

    return fragrances
      .reviews
      .votes
      .upsert(
        { reviewId, userId, vote },
        oc => oc
          .columns(['reviewId', 'userId'])
          .doUpdateSet({ vote })
      )
  }
}