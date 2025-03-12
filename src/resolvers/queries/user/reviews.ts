import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPage, getPagePart, getPaginationInput, getSortPart } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { type FragranceReviewEdge, type FragranceReview, type UserResolvers } from '@src/generated/gql-types'

const BASE_QUERY = /* sql */`
  SELECT
    fr.id,
    fr.rating,
    fr.votes,
    fr.review_text AS review,
    fr.created_at AS "dCreated",
    fr.updated_at AS "dModified",
    fr.deleted_at AS "dDeleted",
    u.username AS author,
    CASE WHEN rv.vote = 1 THEN true WHEN rv.vote = -1 THEN false ELSE null END AS "myVote"
  FROM fragrance_reviews fr
  JOIN users u ON u.id = fr.user_id
  LEFT JOIN fragrance_review_votes rv ON rv.fragrance_review_id = fr.id AND rv.user_id = $1
  WHERE fr.user_id = $1
`

export const userReviews: UserResolvers['reviews'] = async (parent, args, context, info) => {
  const { id } = parent
  const { input } = args
  const { first, after, sort } = getPaginationInput(input?.pagination)
  const { by, direction } = sort
  const { gqlColumn, dbColumn } = getSortColumns(by)
  const { pool } = context

  const values: Array<string | number> = [id]
  const queryParts = [BASE_QUERY]

  if (after != null) {
    const sortPart = getSortPart(direction, dbColumn, values.length, 'fr')
    queryParts.push(sortPart)
    const { sortValue, id } = decodeCursor(after)
    values.push(sortValue, id)
  }

  const pagePart = getPagePart(direction, dbColumn, values.length, 'fr')
  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await pool.query<FragranceReview>(query, values)

  const edges = rows.map<FragranceReviewEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn], row.id)
  }))

  return getPage(edges, first, after)
}
