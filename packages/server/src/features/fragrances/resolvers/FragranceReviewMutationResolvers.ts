import { AGGREGATION_JOB_NAMES, BackendError, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { FragranceReviewResolvers, MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateFragranceReviewInputSchema } from '../utils/validation.js'
import { mapFragranceReviewRowToFragranceReview } from '../utils/mappers.js'

export class FragranceReviewMutationResolvers extends BaseResolver<MutationResolvers> {
  createFragranceReview: MutationResolvers['createFragranceReview'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services, queues } = context
    const me = this.checkAuthenticated(context)

    const { fragranceId } = input
    const parsed = parseOrThrow(CreateFragranceReviewInputSchema, input)

    const { fragrances } = services
    const { aggregations } = queues

    const values = {
      ...parsed,
      fragranceId,
      userId: me.id
    }

    const review = await unwrapOrThrow(fragrances.reviews.createOne(values))

    await aggregations.enqueue({
      jobName: AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REVIEWS,
      data: { fragranceId }
    })

    return mapFragranceReviewRowToFragranceReview(review)
  }

  deleteFragranceReview: MutationResolvers['deleteFragranceReview'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { reviewId } = input
    const { services, queues } = context
    const me = this.checkAuthenticated(context)

    const { fragrances } = services
    const { aggregations } = queues

    const existing = await unwrapOrThrow(
      fragrances.reviews.findOne(where => where('id', '=', reviewId))
    )

    if (existing.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to delete this review.',
        403
      )
    }

    const deleted = await unwrapOrThrow(
      fragrances.reviews.softDeleteOne(where => where('id', '=', reviewId))
    )

    await aggregations.enqueue({
      jobName: AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REVIEWS,
      data: { fragranceId: deleted.fragranceId }
    })

    return mapFragranceReviewRowToFragranceReview(deleted)
  }

  getResolvers (): FragranceReviewResolvers {
    return {
      createFragranceReview: this.createFragranceReview,
      deleteFragranceReview: this.deleteFragranceReview
    }
  }
}