import { encodeCursor } from '@src/common/cursor'
import { getPage, getPaginationInput } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { type FragranceReviewEdge, type UserResolvers } from '@src/generated/gql-types'
import { type UserReviewKey } from '@src/loaders/user-reviews-loader'

export const userReviews: UserResolvers['reviews'] = async (parent, args, context, info) => {
  const { id: userId } = parent
  const { input } = args
  const { first, after, sort } = getPaginationInput(input?.pagination)
  const { gqlColumn } = getSortColumns(sort.by)
  const { dataLoaders } = context

  const key: UserReviewKey = { userId, sort, first, after }
  const reviews = await dataLoaders.userReviews.load(key)

  const edges = reviews.map<FragranceReviewEdge>(review => ({
    node: {
      ...review,
      user: parent
    },
    cursor: encodeCursor(review[gqlColumn], review.id)
  }))

  return getPage(edges, first, after)
}
