import { type FragranceReviewResolvers } from '@src/generated/gql-types'
import { type ReviewUserKey } from '@src/loaders/review-user-loader'

export const reviewUser: FragranceReviewResolvers['user'] = async (parent, args, context, info) => {
  const { id: reviewId, user: parentUser } = parent
  if (parentUser != null) return parentUser

  const { loaders: dataLoaders } = context

  const key: ReviewUserKey = {
    reviewId
  }

  const user = await dataLoaders.reviewUser.load(key)

  return user
}
