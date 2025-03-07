import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { dbSortMapping, gqlSortMapping } from '@src/common/sort-map'
import { type FragranceCollection, type FragranceCollectionEdge, type PageInfo, SortBy, SortDirection, type UserResolvers } from '@src/generated/gql-types'

export const collections: UserResolvers['collections'] = async (parent, args, context, info) => {
  const { id } = parent
  const { pool } = context
  const { first, after, sortBy } = args

  const sortInput = sortBy ?? { by: SortBy.Updated, direction: SortDirection.Desc }
  const gqlColumn = gqlSortMapping[sortInput.by]
  const dbColumn = dbSortMapping[sortInput.by]
  const values: Array<string | number> = [id]

  let query = /* sql */`
    SELECT
      id,
      name,
      updated_at AS "dModified",
      created_at AS "dCreated"
    FROM fragrance_collections
    WHERE user_id = $1
  `

  if (after != null) {
    const decodedAfter = decodeCursor(after)
    query += ` AND ${dbColumn} ${sortInput.direction === SortDirection.Asc
      ? '>'
      : '<'} $${values.length + 1}`
    values.push(decodedAfter)
  }

  query += ` ORDER BY "${gqlColumn}" ${sortInput.direction}`

  if (first != null) {
    query += ` LIMIT $${values.length + 1}`
    values.push(first + 1)
  }

  const { rows } = await pool.query<FragranceCollection>(query, values)

  const hasNextPage = (first != null) && rows.length > first
  const edges = rows.map<FragranceCollectionEdge>(row => ({
    node: { ...row, user: parent },
    cursor: encodeCursor(row[gqlColumn])
  }))

  const startCursor = edges.at(0)?.cursor ?? null
  const endCursor = edges.at(-1)?.cursor ?? null

  const pageInfo: PageInfo = {
    hasNextPage,
    hasPreviousPage: Boolean(after),
    startCursor,
    endCursor
  }

  return { edges, pageInfo }
}
