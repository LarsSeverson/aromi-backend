import { type FragranceReviewResolvers } from '@src/generated/gql-types'
import { type ReviewFragranceKey } from '@src/loaders/review-fragrance-loader'

export const reviewFragrance: FragranceReviewResolvers['fragrance'] = async (parent, args, context, info) => {
  const { id: reviewId } = parent
  const { user, dataLoaders } = context

  const key: ReviewFragranceKey = {
    reviewId,
    myUserId: user?.id
  }
  const fragrance = await dataLoaders.reviewFragrance.load(key)

  return fragrance
}
