import { parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { FragranceReviewResolvers, MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateFragranceReviewInputSchema } from '../utils/validation.js'

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

    const mapped = { ...review, rating: Number(review.rating) }

    return mapped
  }

  getResolvers (): FragranceReviewResolvers {
    return {
      createFragranceReview: this.createFragranceReview
    }
  }
}