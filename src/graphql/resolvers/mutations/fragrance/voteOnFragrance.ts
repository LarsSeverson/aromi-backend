import { Context } from '@src/graphql/schema/context'
import { FragranceVote } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'

interface VoteOnFragranceArgs {
  fragranceId: number
  myVote: boolean | null
}

export const voteOnFragrance = async (parent: undefined, args: VoteOnFragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceVote | null> => {
  const ctxUser = ctx.user

  if (!ctxUser) return null

  const { id: userId } = ctxUser
  const { fragranceId, myVote = null } = args

  const query = `--sql
    WITH old AS (
      SELECT (
        SELECT vote AS old_vote
        FROM fragrance_votes
        WHERE fragrance_id = $1
          AND user_id = $3
          AND deleted_at IS NULL
        LIMIT 1
      ) AS old_vote
    ),
    update_fragrance AS (
      UPDATE fragrances f
      SET
        likes_count = f.likes_count + 
        CASE
          WHEN $2 = true AND old.old_vote IS NULL THEN 1
          WHEN $2 = true AND old.old_vote = -1 THEN 1
          WHEN ($2 = false OR $2 IS NULL) AND old.old_vote = 1 THEN -1
          ELSE 0
        END,
      dislikes_count = f.dislikes_count + 
        CASE
          WHEN $2 = false AND old.old_vote IS NULL THEN 1
          WHEN $2 = false AND old.old_vote = 1 THEN 1
          WHEN ($2 = true OR $2 IS NULL) AND old.old_vote = -1 THEN -1
          ELSE 0
        END
      FROM old
      WHERE f.id = $1
      RETURNING f.likes_count, f.dislikes_count
    ),
    upsert_vote AS (
      INSERT INTO fragrance_votes (fragrance_id, user_id, vote, deleted_at)
      VALUES (
        $1,
        $3,
        CASE WHEN $2 IS NULL THEN 0 WHEN $2 = true THEN 1 ELSE -1 END,
        CASE WHEN $2 IS NULL THEN now() ELSE NULL END
      )
      ON CONFLICT (fragrance_id, user_id)
      DO UPDATE SET
        vote = EXCLUDED.vote,
        deleted_at = CASE WHEN $2 IS NULL THEN now() ELSE NULL END
      RETURNING vote
    )
    SELECT
      uf.likes_count AS likes,
      uf.dislikes_count AS dislikes,
      CASE WHEN uv.vote = 1 THEN true WHEN uv.vote = -1 THEN false ELSE null END AS "myVote"
    FROM update_fragrance uf
    CROSS JOIN upsert_vote uv
  `
  const values = [fragranceId, myVote, userId]

  const res = await ctx.pool.query<FragranceVote>(query, values)

  const fragranceReaction = res.rows[0]

  return fragranceReaction
}
