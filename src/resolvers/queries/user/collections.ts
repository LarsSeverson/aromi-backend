import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPageInfo, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { type FragranceCollection, type FragranceCollectionEdge, type UserResolvers } from '@src/generated/gql-types'

const BASE_QUERY = /* sql */`
  SELECT
    id,
    name,
    created_at AS "dCreated",
    updated_at AS "dModified"
  FROM fragrance_collections
  WHERE user_id = $1 
`

export const collections: UserResolvers['collections'] = async (parent, args, context, info) => {
  const { id } = parent
  const { input } = args
  const { first, after, sortInput } = getPaginationInput(input?.pagination)
  const { pool } = context

  const { gqlColumn, dbColumn } = getSortColumns(sortInput.by)

  const values: Array<string | number> = [id]
  const queryParts = [BASE_QUERY]

  if (after != null) {
    const sortPart = /* sql */`
      AND ${dbColumn} ${getSortDirectionChar(sortInput.direction)} 
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
  const { rows } = await pool.query<FragranceCollection>(query, values)

  const edges = rows.map<FragranceCollectionEdge>(row => ({
    node: { ...row, user: parent },
    cursor: encodeCursor(row[gqlColumn])
  }))

  const pageInfo = getPageInfo(edges, first, after)

  return { edges, pageInfo }
}
