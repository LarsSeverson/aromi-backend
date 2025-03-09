import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPage, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
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
  const { by, direction } = sortInput
  const { gqlColumn, dbColumn } = getSortColumns(by)
  const { user, pool } = context
  const userId = user?.id ?? INVALID_ID

  const values: Array<string | number> = [id, userId]
  const queryParts = [BASE_QUERY]

  if (after != null) {
    const { sortValue, id } = decodeCursor(after)
    const char = getSortDirectionChar(direction)
    const sortPart = /* sql */`
      AND (
        fr.${dbColumn} ${char} $${values.length + 1}
        OR (
          fr.${dbColumn} = $${values.length + 1}
            AND fr.id ${char} $${values.length + 2}
        )
      )
    `
    queryParts.push(sortPart)
    values.push(sortValue, id)
  }

  const pagePart = /* sql */`
    ORDER BY 
      fr."${gqlColumn}" ${direction}, fr.id ${direction}
    LIMIT $${values.length + 1}
  `

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
