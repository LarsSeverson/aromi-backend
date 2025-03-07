import { type FragranceTrait, type MutationResolvers } from '@src/generated/gql-types'

const VOTE_ON_TRAIT_QUERY = `--sql
  WITH inserted AS (
    INSERT INTO fragrance_traits (fragrance_id, trait, value)
    VALUES ($1, $2, $3)
    ON CONFLICT (fragrance_id, trait)
    DO UPDATE SET value = EXCLUDED.value 
    RETURNING id, value
  ),
  vote AS (
    INSERT INTO fragrance_trait_votes (fragrance_trait_id, user_id, value)
    VALUES ((SELECT id FROM inserted), $4, $3)
    ON CONFLICT (fragrance_trait_id, user_id)
    DO UPDATE SET value = $3
    RETURNING *
  )
  SELECT
    id,
    $2 AS trait,
    value,
    $3 AS "myVote"
  FROM inserted
`

export const voteOnTrait: MutationResolvers['voteOnTrait'] = async (parent, args, context, info) => {
  const { user, pool } = context

  if (user === undefined) return null

  const { fragranceId, trait, myVote } = args
  const values = [fragranceId, trait, myVote, user.id]
  const { rows } = await pool.query<FragranceTrait>(VOTE_ON_TRAIT_QUERY, values)

  return rows.at(0) ?? null
}
