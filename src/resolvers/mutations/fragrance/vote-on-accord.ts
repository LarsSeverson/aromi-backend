import { type FragranceAccord, type MutationResolvers } from '@src/generated/gql-types'

const VOTE_ON_ACCORDS_QUERY = /* sql */`
  WITH inserted AS (
    INSERT INTO fragrance_accords (fragrance_id, accord_id)
    VALUES ($1, $2)
    ON CONFLICT (fragrance_id, accord_id)
    DO UPDATE SET votes = fragrance_accords.votes + 
      (CASE
        WHEN COALESCE(
          (SELECT (deleted_at IS NULL) FROM fragrance_accord_votes
          WHERE fragrance_accord_id = fragrance_accords.id AND user_id = $4),
          false
        ) <> $3 THEN
          CASE WHEN $3 IS FALSE THEN -1 ELSE 1 END
        ELSE 0
      END)
    RETURNING id, accord_id, votes
  ),
  vote AS (
    INSERT INTO fragrance_accord_votes (fragrance_accord_id, user_id)
    VALUES ((SELECT id FROM inserted), $4)
    ON CONFLICT (fragrance_accord_id, user_id)
    DO UPDATE SET deleted_at = 
      CASE 
        WHEN (fragrance_accord_votes.deleted_at IS NULL AND $3 IS FALSE) THEN CURRENT_TIMESTAMP
        WHEN (fragrance_accord_votes.deleted_at IS NOT NULL AND $3 IS TRUE) THEN NULL
        ELSE fragrance_accord_votes.deleted_at
      END
    RETURNING *
  )
  SELECT
    i.id,
    a.id AS "accordId",
    a.name,
    a.color,
    i.votes,
    $3 AS "myVote"
  FROM inserted i
  JOIN accords a ON a.id = i.accord_id
`

export const voteOnAccord: MutationResolvers['voteOnAccord'] = async (parent, args, context, info) => {
  const { user, pool } = context

  if (user === undefined) return null

  const { fragranceId, accordId, myVote } = args

  const values = [fragranceId, accordId, myVote, user.id]
  const { rows } = await pool.query<FragranceAccord>(VOTE_ON_ACCORDS_QUERY, values)

  return rows.at(0) ?? null
}
