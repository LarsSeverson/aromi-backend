import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPage, getPagePart, getPaginationInput, getSortPart } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { type FragranceEdge, type Fragrance, type UserResolvers } from '@src/generated/gql-types'

const BASE_QUERY = /* sql */`
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
      'myVote', true
    ) AS votes,
    f.created_at AS "dCreated",
    f.updated_at AS "dModified"
  FROM fragrance_votes fv
  JOIN fragrances f ON f.id = fv.fragrance_id
  WHERE fv.user_id = $1 AND fv.vote = 1
`

export const userLikes: UserResolvers['likes'] = async (parent, args, context, info) => {
  const { id } = parent
  const { input } = args
  const { sources } = context
  const { db } = sources

  const { first, after, sort } = getPaginationInput(input?.pagination)
  const { by, direction } = sort
  const { gqlColumn, dbColumn } = getSortColumns(by)

  const values: Array<string | number> = [id]
  const queryParts = [BASE_QUERY]

  if (after != null) {
    const sortPart = getSortPart(direction, dbColumn, values.length, 'f')
    queryParts.push(sortPart)
    const { sortValue, id } = decodeCursor(after)
    values.push(sortValue, id)
  }

  const pagePart = getPagePart(direction, dbColumn, values.length, 'f')
  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await db.query<Fragrance>(query, values)

  const edges = rows.map<FragranceEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn], row.id)
  }))

  return getPage(edges, first, after)
}
