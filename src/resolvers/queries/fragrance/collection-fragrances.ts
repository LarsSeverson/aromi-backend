import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPageInfo, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { INVALID_ID } from '@src/common/types'
import { type FragranceEdge, type Fragrance, type FragranceCollectionResolvers } from '@src/generated/gql-types'

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
    WHERE user_id = $2
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
  FROM collection_fragrances cf
  JOIN fragrances f ON f.id = cf.fragrance_id
  LEFT JOIN votes_data vd ON vd.fragrance_id = f.id
  WHERE cf.collection_id = $1
`

export const collectionFragrances: FragranceCollectionResolvers['fragrances'] = async (parent, args, context, info) => {
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
      AND f.${dbColumn} ${getSortDirectionChar(sortInput.direction)}
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
  const { rows } = await pool.query<Fragrance>(query, values)

  const edges = rows.map<FragranceEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn])
  }))

  const pageInfo = getPageInfo(edges, first, after)

  return { edges, pageInfo }
}
