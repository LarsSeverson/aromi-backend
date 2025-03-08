import { type FragranceNote, type NoteLayer, type FragranceNotesResolvers, type FragranceNoteEdge } from '@src/generated/gql-types'
import { getPageInfo, getPaginationInput, getSortDirectionChar } from '@src/common/pagination'
import { INVALID_ID } from '@src/common/types'
import { getSortColumns } from '@src/common/sort-map'
import { decodeCursor, encodeCursor } from '@src/common/cursor'
import { getSignedImages } from '@src/common/images'

const NO_FILL_BASE_QUERY = /* sql */`
  SELECT
    fn.id,
    n.id AS "noteId",
    n.name,
    n.s3_key as icon,
    fn.layer,
    fn.votes,
    CASE WHEN fnv.id IS NOT NULL THEN true ELSE false END AS "myVote"
  FROM fragrance_notes fn
  JOIN notes n ON n.id = fn.note_id
  LEFT JOIN fragrance_note_votes fnv ON fnv.fragrnace_note_id = fn.id
    AND fnv.user_id = $3
    AND fnv.deleted_at IS NULL
  WHERE fn.fragrance_id = $1
    AND fn.layer = $2
`

const FILL_BASE_QUERY = /* sql */`
  WITH actual AS (
    SELECT
      fn.id,
      n.id AS "noteId",
      n.name,
      n.s3_key as icon,
      fn.layer,
      fn.votes,
      CASE WHEN fnv.id IS NOT NULL THEN true ELSE false END AS "myVote"
    FROM fragrance_notes fn
    JOIN notes n ON n.id = fn.note_id
    LEFT JOIN fragrance_note_votes fnv ON fnv.fragrnace_note_id = fn.id
      AND fnv.user_id = $3
      AND fnv.deleted_at IS NULL
    WHERE fn.fragrance_id = $1
      AND fn.layer = $2
  ),
  fillers AS (
    SELECT
      n.id,
      n.id AS "noteId",
      n.name,
      n.s3_key as icon,
      $2 AS layer,
      0 AS votes,
      false AS "myVote"
    FROM notes n
    WHERE NOT EXISTS (
      SELECT 1
      FROM actual act 
      WHERE act."noteId" = n.id
        AND act.layer = $2
    )
  )
  SELECT *
  FROM (
    SELECT * FROM actual
    UNION ALL
    SELECT * FROM fillers
  ) x
`

export const notes: FragranceNotesResolvers['base' | 'middle' | 'top'] = async (parent, args, context, info) => {
  const { fragranceId } = parent
  const { input } = args
  const { first, after, sortInput } = getPaginationInput(input?.pagination, 15)
  const { user, pool } = context
  const userId = user?.id ?? INVALID_ID
  const fill = input?.fill ?? false
  const layer = info.fieldName as NoteLayer

  const { gqlColumn, dbColumn } = getSortColumns(sortInput.by)

  const values: Array<string | number> = [fragranceId, layer, userId]
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
  const { rows } = await pool.query<FragranceNote>(query, values)

  const signedIcons = await getSignedImages(rows, 'icon')
  const edges = signedIcons.map<FragranceNoteEdge>(row => ({
    node: row,
    cursor: encodeCursor(row[gqlColumn])
  }))

  const pageInfo = getPageInfo(edges, first, after)

  return { edges, pageInfo }
}
