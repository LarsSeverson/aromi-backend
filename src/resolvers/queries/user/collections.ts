import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPage, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
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
  const { by, direction } = sortInput
  const { gqlColumn, dbColumn } = getSortColumns(by)
  const { pool } = context

  const values: Array<string | number> = [id]
  const queryParts = [BASE_QUERY]

  if (after != null) {
    const { sortValue, id } = decodeCursor(after)
    const char = getSortDirectionChar(direction)
    const sortPart = /* sql */`
      AND (
        ${dbColumn} ${char} $${values.length + 1}
        OR (
          ${dbColumn} = $${values.length + 1}
            AND id ${char} $${values.length + 2}
        )
      )
    `
    queryParts.push(sortPart)
    values.push(sortValue, id)
  }

  const pagePart = /* sql */`
    ORDER BY 
      "${gqlColumn}" ${direction}, id ${direction}
    LIMIT $${values.length + 1}
  `

  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await pool.query<FragranceCollection>(query, values)

  const edges = rows.map<FragranceCollectionEdge>(row => ({
    node: { ...row, user: parent },
    cursor: encodeCursor(row[gqlColumn], row.id)
  }))

  return getPage(edges, first, after)
}
