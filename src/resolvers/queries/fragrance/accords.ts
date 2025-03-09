import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPage, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { INVALID_ID } from '@src/common/types'
import { type FragranceAccordEdge, type FragranceAccord, type FragranceResolvers } from '@src/generated/gql-types'

const NO_FILL_BASE_QUERY = /* sql */`
  SELECT
    fa.id,
    a.id as "accordId",
    a.name,
    a.color,
    fa.votes,
    CASE WHEN fav.id IS NOT NULL THEN true ELSE false END AS "myVote",
    fa.created_at AS "dCreated",
    fa.updated_at AS "dModified"
  FROM fragrance_accords fa
  JOIN accords a ON a.id = fa.accord_id
  LEFT JOIN fragrance_accord_votes fav ON fav.fragrance_accord_id = fa.id
    AND fav.user_id = $2
    AND fav.deleted_at IS NULL
  WHERE fa.fragrance_id = $1
`

const FILL_BASE_QUERY = /* sql */`
  WITH actual AS (
    SELECT
      fa.id,
      a.id as "accordId",
      a.name,
      a.color,
      fa.votes,
      CASE WHEN fav.id IS NOT NULL THEN true ELSE false END AS "myVote",
      fa.created_at AS "dCreated",
      fa.updated_at AS "dModified"
    FROM fragrance_accords fa
    JOIN accords a ON a.id = fa.accord_id
    LEFT JOIN fragrance_accord_votes fav ON fav.fragrance_accord_id = fa.id
      AND fav.user_id = $2
      AND fav.deleted_at IS NULL
    WHERE fa.fragrance_id = $1
  ),
  fillers AS (
    SELECT
      a.id,
      a.id AS "accordId",
      a.name,
      a.color,
      0 AS votes,
      false AS "myVote",
      a.created_at AS "dCreated",
      a.updated_at AS "dModified"
    FROM accords a
    WHERE NOT EXISTS (
      SELECT 1
      FROM actual act 
      WHERE act."accordId" = a.id
    )
  )
  SELECT *
  FROM (
    SELECT * FROM actual
    UNION ALL
    SELECT * FROM fillers
  ) x
`

export const accords: FragranceResolvers['accords'] = async (parent, args, context, info) => {
  const { id } = parent
  const { input } = args
  const { first, after, sortInput } = getPaginationInput(input?.pagination, 30)
  const { by, direction } = sortInput
  const { gqlColumn } = getSortColumns(by)
  const { user, pool } = context
  const userId = user?.id ?? INVALID_ID
  const fill = input?.fill ?? false

  const values: Array<string | number> = [id, userId]
  const baseQuery = fill ? FILL_BASE_QUERY : NO_FILL_BASE_QUERY
  const queryParts: string[] = []

  const wrapPart = /* sql */`
    SELECT * FROM (${baseQuery}) AS x
  `
  queryParts.push(wrapPart)

  if (after != null) {
    const { sortValue, id } = decodeCursor(after)
    const char = getSortDirectionChar(direction)
    const sortPart = /* sql */`
      WHERE x."${gqlColumn}" ${char} $${values.length + 1}
        OR (
          x."${gqlColumn}" = $${values.length + 1} 
            AND x.id ${char} $${values.length + 2}
        )
    `
    queryParts.push(sortPart)
    values.push(sortValue, id)
  }

  const pagePart = /* sql */`
    ORDER BY 
      x."${gqlColumn}" ${direction}, x.id ${direction}
    LIMIT $${values.length + 1}
  `

  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await pool.query<FragranceAccord>(query, values)

  const edges = rows.map<FragranceAccordEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn], row.id)
  }))

  return getPage(edges, first, after)
}
