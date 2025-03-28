import { type FragranceReviewResolvers } from '@src/generated/gql-types'

export const reviewFragrance: FragranceReviewResolvers['fragrance'] = async (parent, args, context, info) => {
  const { id: reviewId, user } = parent
  const { id: userId } = user
  const { dataLoaders } = context

  const key = { reviewId, userId }
  const fragrance = await dataLoaders.reviewFragrance.load(key)

  return fragrance
}
