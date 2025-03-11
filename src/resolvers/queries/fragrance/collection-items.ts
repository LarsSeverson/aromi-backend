import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPage, getPagePart, getPaginationInput, getSortPart } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { INVALID_ID } from '@src/common/types'
import { type FragranceCollectionResolvers, type FragranceCollectionItem, type FragranceCollectionItemEdge } from '@src/generated/gql-types'

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
    cf.id,
    JSONB_BUILD_OBJECT(
      'id', f.id,
      'brand', f.brand,
      'name', f.name,
      'reviewsCount', f.reviews_count,
      'rating', COALESCE(f.rating, 0),
      'votes', JSONB_BUILD_OBJECT(
        'id', f.id,
        'likes', f.likes_count,
        'dislikes', f.dislikes_count,
        'myVote', vd.vote
      )
    ) AS fragrance,
    cf.created_at AS "dCreated",
    cf.updated_at AS "dModified"
  FROM collection_fragrances cf
  JOIN fragrances f ON f.id = cf.fragrance_id
  LEFT JOIN votes_data vd ON vd.fragrance_id = f.id
  WHERE cf.collection_id = $1 AND cf.deleted_at IS NULL
`

export const collectionItems: FragranceCollectionResolvers['items'] = async (parent, args, context, info) => {
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
    const sortPart = getSortPart(direction, dbColumn, values.length, 'cf')
    queryParts.push(sortPart)
    const { sortValue, id } = decodeCursor(after)
    values.push(sortValue, id)
  }

  const pagePart = getPagePart(direction, dbColumn, values.length, 'cf')
  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await pool.query<FragranceCollectionItem>(query, values)

  const edges = rows.map<FragranceCollectionItemEdge>(row => ({
    node: {
      ...row,
      collection: parent
    },
    cursor: encodeCursor(row[gqlColumn], row.id)
  }))

  return getPage(edges, first, after)
}
