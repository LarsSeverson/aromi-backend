import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceNote, NoteLayerType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

const noFillQuery = (queryParts: string[]) => `--sql
  SELECT COALESCE(JSONB_AGG(
    JSONB_BUILD_OBJECT(${queryParts.join(', ')})
    ORDER BY fn.votes DESC
  ), '[]'::JSONB) as notes,
  $2 as _dummy
  FROM fragrance_notes fn
  JOIN notes n ON n.id = fn.note_id
  LEFT JOIN (
    SELECT fragrance_note_id, TRUE AS user_vote
    FROM fragrance_note_votes
    WHERE user_id = $2 AND deleted_at IS NULL
  ) fnv on fnv.fragrance_note_id = fn.id
  WHERE fn.fragrance_id = $1 AND fn.layer = $3
  LIMIT $4
  OFFSET $5
`

const fillQuery = (queryParts: string[], fillerParts: string[]) => `--sql
  SELECT COALESCE(JSONB_AGG(t.item ORDER BY t.order_votes DESC), '[]'::JSONB) AS notes,
  $2 AS _dummy
  FROM (
    SELECT *
    FROM (
      SELECT JSONB_BUILD_OBJECT(${queryParts.join(', ')}) AS item, fn.votes AS order_votes
      FROM fragrance_notes fn
      JOIN notes n ON n.id = fn.note_id
      LEFT JOIN (
        SELECT fragrance_note_id, TRUE AS user_vote
        FROM fragrance_note_votes
        WHERE user_id = $2 AND deleted_at IS NULL
      ) fnv ON fnv.fragrance_note_id = fn.id
      WHERE fn.fragrance_id = $1 and fn.layer = $3
      UNION ALL
      SELECT JSONB_BUILD_OBJECT(${fillerParts.join(', ')}) AS item, 0 AS order_votes
      FROM notes n 
      WHERE n.id NOT IN (
        SELECT note_id FROM fragrance_notes WHERE fragrance_id = $1
      )
    ) combined
    ORDER BY order_votes DESC
    LIMIT $4
    OFFSET $5
  ) t 
`

export interface NoteFields {
  id: boolean
  name: boolean
  layer: boolean
  votes: boolean
  myVote: boolean
}

const notesQueryParts = (fields: NoteFields): string[] => {
  const parts: string[] = []

  if (fields.id) parts.push("'id', fn.id")
  if (fields.name) parts.push("'name', n.name")
  if (fields.layer) parts.push("'layer', fn.layer")
  if (fields.votes) parts.push("'votes', fn.votes")
  if (fields.myVote) parts.push("'myVote', COALESCE(fnv.user_vote, false)")

  return parts
}

const notesFillerQueryParts = (fields: NoteFields, layer: NoteLayerType): string[] => {
  const parts: string[] = []

  if (fields.id) parts.push("'id', n.id")
  if (fields.name) parts.push("'name', n.name")
  if (fields.layer) parts.push(`'layer', '${layer}'`)
  if (fields.votes) parts.push("'votes', 0")
  if (fields.myVote) parts.push("'myVote', false")

  return parts
}

interface FragranceNotesArgs {
  limit?: number | undefined
  offset?: number | undefined

  fill?: boolean | undefined
}

export const notes = async (parent: Fragrance, args: FragranceNotesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceNote[] | null> => {
  const user = ctx.user || null
  const fragranceId = parent.id

  const { limit = 10, offset = 0, fill = false } = args

  if (!fragranceId) return null

  const layer: NoteLayerType = info.fieldName as NoteLayerType
  const fields: NoteFields = graphqlFields(info)

  const parts = notesQueryParts(fields)
  const fillerParts = (fill && notesFillerQueryParts(fields, layer)) || []

  const query = fill ? fillQuery(parts, fillerParts) : noFillQuery(parts)
  const values = [fragranceId, user?.id, layer, limit, offset]

  const result = await ctx.pool.query<{'notes': FragranceNote[]}>(query, values)

  const notes = result.rows[0].notes

  return notes
}
