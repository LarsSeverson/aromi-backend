import { type FragranceNote, type MutationResolvers } from '@src/generated/gql-types'

const VOTE_ON_NOTE_QUERY = `--sql
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
  SELECT
    i.id,
    n.id AS "noteId",
    n.name,
    i.votes,
    $3 AS layer,
    $4 AS "myVote"
  FROM inserted i
  JOIN notes n ON n.id = i.note_id
`

export const voteOnNote: MutationResolvers['voteOnNote'] = async (parent, args, context, info) => {
  const { user, pool } = context

  if (user === undefined) return null

  const { fragranceId, noteId, layer, myVote } = args
  const values = [fragranceId, noteId, layer, myVote, user.id]
  const { rows } = await pool.query<FragranceNote>(VOTE_ON_NOTE_QUERY, values)

  return rows.at(0) ?? null
}
