import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPageInfo, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { INVALID_ID } from '@src/common/types'
import { type FragranceReviewEdge, type FragranceResolvers, type FragranceReview } from '@src/generated/gql-types'

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
  LEFT JOIN fragrance_review_votes rv ON rv.fragrance_review_id = fr.id AND rv.user_id = $2
  WHERE fr.fragrance_id = $1
`

export const reviews: FragranceResolvers['reviews'] = async (parent, args, context, info) => {
  const { id } = parent
  const { input } = args
  const { first, after, sortInput } = getPaginationInput(input?.pagination)
  const { user, pool } = context
  const userId = user?.id ?? INVALID_ID

  const { gqlColumn, dbColumn } = getSortColumns(sortInput.by)

  const values: Array<string | number> = [id, userId]
  const queryParts = [BASE_QUERY]

  if (after != null) {
    const sortPart = /* sql */`
      WHERE fr.${dbColumn} ${getSortDirectionChar(sortInput.direction)}
      $${values.length + 1}
    `
    queryParts.push(sortPart)
    values.push(decodeCursor(after))
  }

  const pagePart = /* sql */`
    ORDER BY "${gqlColumn}" ${sortInput.direction}
    LIMIT $${values.length + 1}
  `

  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await pool.query<FragranceReview>(query, values)

  const edges = rows.map<FragranceReviewEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn])
  }))

  const pageInfo = getPageInfo(edges, first, after)

  return { edges, pageInfo }
}
