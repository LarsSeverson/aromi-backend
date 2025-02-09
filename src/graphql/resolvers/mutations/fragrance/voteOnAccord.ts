import { Context } from '@src/graphql/schema/context'
import { FragranceAccord } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

interface VoteOnAccordsFields {
  id: boolean
  name: boolean
  votes: boolean
  color: boolean
  myVote: boolean
}

interface VoteOnAccordArgs {
  fragranceId: number
  accordId: number

  myVote: boolean
}

export const voteOnAccord = async (parent: undefined, args: VoteOnAccordArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceAccord | null> => {
  const ctxUser = ctx.user

  if (!ctxUser) return null

  const { id: userId } = ctxUser
  const { fragranceId, accordId, myVote } = args

  const fields = graphqlFields(info)

  const query = `--sql
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
  const values = [fragranceId, accordId, myVote, userId]

  const res = await ctx.pool.query<FragranceAccord>(query, values)

  const accord = res.rows[0]

  return accord
}
