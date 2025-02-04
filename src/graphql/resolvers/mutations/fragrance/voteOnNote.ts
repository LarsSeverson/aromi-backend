import { Context } from '@src/graphql/schema/context'
import { FragranceNote, NoteLayerType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

interface VoteOnAccordsFields {
  id: boolean
  layer: boolean
  name: boolean
  votes: boolean
  myVote: boolean
}

const voteOnNotesQueryParts = (fields: VoteOnAccordsFields): string[] => {
  const parts: string[] = []

  if (fields.id) parts.push('n.id')
  if (fields.name) parts.push('n.name')
  if (fields.layer) parts.push('$3 as "layer"')
  if (fields.votes) parts.push('i.votes')
  if (fields.myVote) parts.push('$4 as "myVote"')

  return parts
}

interface VoteOnNoteArgs {
  fragranceId: number
  noteId: number
  layer: NoteLayerType

  myVote: boolean
}

export const voteOnNote = async (parent: undefined, args: VoteOnNoteArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceNote | null> => {
  const ctxUser = ctx.user

  if (!ctxUser) return null

  const { id: userId } = ctxUser
  const { fragranceId, noteId, layer, myVote } = args

  const fields = graphqlFields(info)
  const parts = voteOnNotesQueryParts(fields)

  const query = `--sql
    WITH inserted AS (
      INSERT INTO fragrance_notes (fragrance_id, note_id, layer)
      VALUES ($1, $2, $3)
      ON CONFLICT (fragrance_id, note_id, layer)
      DO UPDATE SET votes = fragrance_notes.votes + 
        (CASE
          WHEN COALESCE(
            (SELECT (deleted_at IS NULL) FROM fragrance_note_votes
            WHERE fragrance_note_id = fragrance_notes.id AND user_id = $5),
            false
          ) <> $4 THEN
            CASE WHEN $4 IS FALSE THEN -1 ELSE 1 END
          ELSE 0
        END)
      RETURNING id, note_id, votes
    ),
    vote AS (
      INSERT INTO fragrance_note_votes (fragrance_note_id, user_id)
      VALUES ((SELECT id FROM inserted), $5)
      ON CONFLICT (fragrance_note_id, user_id)
      DO UPDATE SET deleted_at = 
        CASE 
          WHEN (fragrance_note_votes.deleted_at IS NULL AND $4 IS FALSE) THEN CURRENT_TIMESTAMP
          WHEN (fragrance_note_votes.deleted_at IS NOT NULL AND $4 IS TRUE) THEN NULL
          ELSE fragrance_note_votes.deleted_at
        END
      RETURNING *
    )
    SELECT ${parts.join(', ')}
    FROM inserted i
    JOIN notes n ON n.id = i.note_id
  `
  const values = [fragranceId, noteId, layer, myVote, userId]

  const res = await ctx.pool.query<FragranceNote>(query, values)

  const accord = res.rows[0]

  return accord
}
