import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPage, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { INVALID_ID } from '@src/common/types'
import { type FragranceEdge, type Fragrance, type QueryResolvers } from '@src/generated/gql-types'

const BASE_QUERY = /* sql */`
  WITH votes_data AS (
    SELECT
      fragrance_id,
      CASE
        WHEN vote = 1 THEN true
        WHEN vote = -1 THEN false
        ELSE NULL
      END AS vote
    FROM fragrance_votes
    WHERE user_id = $1
  )
  SELECT
    f.id,
    f.brand,
    f.name,
    f.reviews_count AS "reviewsCount",
    COALESCE(f.rating, 0) AS rating,
    JSONB_BUILD_OBJECT(
      'id', f.id,
      'likes', f.likes_count,
      'dislikes', f.dislikes_count,
      'myVote', vd.vote
    ) AS votes,
    f.created_at AS "dCreated",
    f.updated_at AS "dModified"
  FROM fragrances f
  LEFT JOIN votes_data vd ON vd.fragrance_id = f.id
`

export const fragrances: QueryResolvers['fragrances'] = async (parent, args, context, info) => {
  const { input } = args
  const { first, after, sortInput } = getPaginationInput(input?.pagination)
  const { by, direction } = sortInput
  const { user, pool } = context
  const userId = user?.id ?? INVALID_ID

  const { gqlColumn, dbColumn } = getSortColumns(by)

  const values: Array<string | number> = [userId]
  const queryParts = [BASE_QUERY]

  if (after != null) {
    const { sortValue, id } = decodeCursor(after)
    const char = getSortDirectionChar(direction)
    const sortPart = /* sql */`
      WHERE f.${dbColumn} ${char} $${values.length + 1}
        OR (
          f.${dbColumn} = $${values.length + 1}
            AND f.id ${char} $${values.length + 2}
        )
    `
    queryParts.push(sortPart)
    values.push(sortValue, id)
  }

  const pagePart = /* sql */` 
    ORDER BY 
      f."${gqlColumn}" ${direction}, f.id ${direction}
    LIMIT $${values.length + 1}
  `

  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await pool.query<Fragrance>(query, values)

  const edges = rows.map<FragranceEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn], row.id)
  }))

  return getPage(edges, first, after)
}
