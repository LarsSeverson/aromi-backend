import { encodeCursor } from '@src/common/cursor'
import { getPage, getPaginationInput } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { type FragranceReviewEdge, type FragranceResolvers } from '@src/generated/gql-types'
import { type FragranceReviewKey } from '@src/loaders/fragrance-review-loader'

export const reviews: FragranceResolvers['reviews'] = async (parent, args, context, info) => {
  const { id: fragranceId } = parent
  const { input } = args
  const { first, after, sort } = getPaginationInput(input?.pagination)
  const { by } = sort
  const { gqlColumn } = getSortColumns(by)
  const { user, dataLoaders } = context

  const key: FragranceReviewKey = { fragranceId, myUserId: user?.id, sort, first, after }
  const reviews = await dataLoaders.fragranceReviews.load(key)

  const edges = reviews.map<FragranceReviewEdge>(review => ({
    node: {
      ...review,
      fragrance: parent
    },
    cursor: encodeCursor(review[gqlColumn], review.id)
  }))

  return getPage(edges, first, after)
}
