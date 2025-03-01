import { type FragranceNote, type NoteLayer, type FragranceNotesResolvers } from '@src/generated/gql-types'
import { generateSignedUrl } from '@src/utils/s3'

const noFillQuery = (): string => `--sql
  SELECT
    fn.id,
    n.id AS "noteId",
    n.name,
    n.s3_key as icon,
    fn.layer,
    fn.votes,
    EXISTS(
      SELECT 1
      FROM fragrance_note_votes fnv
      WHERE fnv.fragrance_note_id = fn.id
        AND fnv.user_id = $3
        AND fnv.deleted_at IS NULL
    ) AS "myVote"
  FROM fragrance_notes fn
  JOIN notes n ON n.id = fn.note_id
  WHERE fn.fragrance_id = $1
    AND fn.layer = $2
    AND fn.votes > 0
  ORDER BY fn.votes DESC
  LIMIT $4
  OFFSET $5
`

const fillQuery = (): string => `--sql
  WITH actual AS (
    SELECT
      fn.id,
      n.id AS "noteId",
      n.name,
      n.s3_key as icon,
      fn.layer,
      fn.votes,
      EXISTS(
        SELECT 1
        FROM fragrance_note_votes fnv
        WHERE fnv.fragrance_note_id = fn.id
          AND fnv.user_id = $3
          AND fnv.deleted_at IS NULL
      ) AS "myVote"
    FROM fragrance_notes fn
    JOIN notes n ON n.id = fn.note_id
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
      FROM fragrance_notes fn
      WHERE fn.fragrance_id = $1
        AND fn.note_id = n.id
        AND fn.layer = $2
    )
  )
  SELECT
    id,
    "noteId",
    name,
    icon,
    layer,
    votes,
    "myVote"
  FROM (
    SELECT * FROM actual
    UNION ALL
    SELECT * FROM fillers
  ) x
  ORDER BY votes DESC
  LIMIT $4
  OFFSET $5
`

export const notes: FragranceNotesResolvers['base' | 'middle' | 'top'] = async (parent, args, context, info) => {
  const { fragranceId } = parent
  const { limit = 8, offset = 0, fill = false } = args
  const { user, pool } = context
  const layer = info.fieldName as NoteLayer

  const query = (fill ?? false) ? fillQuery() : noFillQuery()
  const values = [fragranceId, layer, user?.id, limit, offset]
  const { rows } = await pool.query<FragranceNote>(query, values)

  const notes = await Promise.all(rows.map<Promise<FragranceNote>>(async note => {
    try {
      const url = await generateSignedUrl(note.icon)
      return { ...note, iconUrl: url }
    } catch (error) {
      return { ...note, iconUrl: '' }
    }
  }))

  return notes
}
