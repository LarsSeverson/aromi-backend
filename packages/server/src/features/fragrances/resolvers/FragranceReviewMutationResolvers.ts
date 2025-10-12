import { BackendError, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
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
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { fragranceId } = input
    const parsed = parseOrThrow(CreateFragranceReviewInputSchema, input)
    const { fragrances } = services

    const values = {
      ...parsed,
      fragranceId,
      userId: me.id
    }

    const review = await unwrapOrThrow(fragrances.reviews.createOne(values))

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
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { fragrances } = services

    const existing = await unwrapOrThrow(
      fragrances.reviews.findOne(eb => eb('id', '=', reviewId))
    )

    if (existing.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to delete this review.',
        403
      )
    }

    const deleted = await unwrapOrThrow(
      fragrances.reviews.softDeleteOne(eb => eb('id', '=', reviewId))
    )

    return mapFragranceReviewRowToFragranceReview(deleted)
  }

  getResolvers (): FragranceReviewResolvers {
    return {
      createFragranceReview: this.createFragranceReview,
      deleteFragranceReview: this.deleteFragranceReview
    }
  }
}