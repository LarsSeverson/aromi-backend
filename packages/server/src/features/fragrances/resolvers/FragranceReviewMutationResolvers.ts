import { AGGREGATION_JOB_NAMES, BackendError, INDEXATION_JOB_NAMES, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { FragranceReviewResolvers, MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateFragranceReviewInputSchema, UpdateFragranceReviewInputSchema } from '../utils/validation.js'
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
    const { aggregations, indexations } = queues

    const values = {
      ...parsed,
      fragranceId,
      userId: me.id,
      deletedAt: null
    }

    const review = await unwrapOrThrow(
      fragrances.reviews.upsert(
        values,
        oc => oc
          .columns(['fragranceId', 'userId'])
          .doUpdateSet(values)
      )
    )

    await aggregations.enqueue({
      jobName: AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REVIEWS,
      data: { fragranceId }
    })

    await indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.INDEX_REVIEW,
      data: { reviewId: review.id }
    })

    return mapFragranceReviewRowToFragranceReview(review)
  }

  updateFragranceReview: MutationResolvers['updateFragranceReview'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services, queues } = context
    const me = this.checkAuthenticated(context)

    const { reviewId } = input
    const parsed = parseOrThrow(UpdateFragranceReviewInputSchema, input)

    const { fragrances } = services
    const { aggregations, indexations } = queues

    const existing = await unwrapOrThrow(
      fragrances.reviews.findOne(where => where('id', '=', reviewId))
    )

    if (existing.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to update this review.',
        403
      )
    }

    const updated = await unwrapOrThrow(
      fragrances.reviews.updateOne(
        where => where('id', '=', reviewId),
        parsed
      )
    )

    await aggregations.enqueue({
      jobName: AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REVIEWS,
      data: { fragranceId: updated.fragranceId }
    })

    await indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.UPDATE_REVIEW,
      data: { reviewId: updated.id }
    })

    return mapFragranceReviewRowToFragranceReview(updated)
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
    const { aggregations, indexations } = queues

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

    await indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.DELETE_REVIEW,
      data: { reviewId: deleted.id }
    })

    return mapFragranceReviewRowToFragranceReview(deleted)
  }

  getResolvers (): FragranceReviewResolvers {
    return {
      createFragranceReview: this.createFragranceReview,
      updateFragranceReview: this.updateFragranceReview,
      deleteFragranceReview: this.deleteFragranceReview
    }
  }
}