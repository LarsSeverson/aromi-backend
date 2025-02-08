import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceNote, NoteLayerType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

const noFillQuery = () => `--sql
  SELECT
    fn.id,
    n.id AS "noteId",
    n.name,
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

const fillQuery = () => `--sql
  WITH actual AS (
    SELECT
      fn.id,
      n.id AS "noteId",
      n.name,
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
      n.id AS "accordId",
      n.name,
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

export interface NoteFields {
  id: boolean
  name: boolean
  layer: boolean
  votes: boolean
  myVote: boolean
}

interface FragranceNotesArgs {
  limit?: number | undefined
  offset?: number | undefined

  fill?: boolean | undefined
}

export const notes = async (parent: Fragrance, args: FragranceNotesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceNote[] | null> => {
  const user = ctx.user || null
  const fragranceId = parent.id

  const {
    limit = 10,
    offset = 0,
    fill = false
  } = args

  if (!fragranceId) return null

  const fields: NoteFields = graphqlFields(info)
  const layer = info.fieldName as NoteLayerType
  const userId = user?.id

  const query = fill ? fillQuery() : noFillQuery()
  const values = [fragranceId, layer, userId, limit, offset]

  const result = await ctx.pool.query<FragranceNote>(query, values)

  const notes = result.rows

  return notes
}
