import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceNote, NoteLayerType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

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
  if (fields.myVote) {
    parts.push(`'myVote', (
      SELECT EXISTS (
        SELECT 1
        FROM fragrance_note_votes
        WHERE fragrance_note_id = fn.id
          AND user_id = $2
          AND deleted_at IS NULL
      )
    )`)
  }

  return parts
}

interface FragranceNotesArgs {
  limit: number
  offset: number
}

export const notes = async (parent: Fragrance, args: FragranceNotesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceNote[] | null> => {
  const userId = ctx.userId || null
  const fragranceId = parent.id
  const { limit = 10, offset = 0 } = args

  if (!fragranceId) return null

  const layer: NoteLayerType = info.fieldName as NoteLayerType
  const fields: NoteFields = graphqlFields(info)

  const parts = notesQueryParts(fields)

  const query = `
    SELECT COALESCE(JSONB_AGG(
      JSONB_BUILD_OBJECT(${parts.join(', ')})
      ORDER BY fn.votes DESC
    ), '[]'::JSONB) AS notes,
    $2 AS _dummy
    FROM fragrance_notes fn
    JOIN notes n ON n.id = fn.note_id
    WHERE fn.fragrance_id = $1 AND fn.layer = $3::note_layer
    LIMIT $4
    OFFSET $5
  `
  const values = [fragranceId, userId, layer, limit, offset]

  const result = await ctx.pool.query<{'notes': FragranceNote[]}>(query, values)

  const notes = result.rows[0].notes

  return notes
}
