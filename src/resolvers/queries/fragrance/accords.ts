import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getPageInfo, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
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
    CASE WHEN fav.id IS NOT NULL THEN true ELSE false END AS "myVote"
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
      CASE WHEN fav.id IS NOT NULL THEN true ELSE false END AS "myVote"
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
      false AS "myVote"
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
  const { first, after, sortInput } = getPaginationInput(input?.pagination, 15)
  const { user, pool } = context
  const userId = user?.id ?? INVALID_ID
  const fill = input?.fill ?? false

  const { gqlColumn, dbColumn } = getSortColumns(sortInput.by)

  const values: Array<string | number> = [id, userId]
  const baseQuery = fill ? FILL_BASE_QUERY : NO_FILL_BASE_QUERY
  const queryParts: string[] = []

  const wrapPart = /* sql */`
    SELECT * FROM (${baseQuery}) AS x
  `
  queryParts.push(wrapPart)

  if (after != null) {
    const sortPart = /* sql */`
      WHERE x.${dbColumn} ${getSortDirectionChar(sortInput.direction)}
      $${values.length + 1}
    `
    queryParts.push(sortPart)
    values.push(decodeCursor(after))
  }

  const pagePart = /* sql */`
    ORDER BY x."${gqlColumn}" ${sortInput.direction}
    LIMIT $${values.length + 1}
  `

  queryParts.push(pagePart)
  values.push(first + 1)

  const query = queryParts.join('\n')
  const { rows } = await pool.query<FragranceAccord>(query, values)

  const edges = rows.map<FragranceAccordEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn])
  }))

  const pageInfo = getPageInfo(edges, first, after)

  return { edges, pageInfo }
}
