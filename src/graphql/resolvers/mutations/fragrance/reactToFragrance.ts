import { Context } from '@src/graphql/schema/context'
import { FragranceReaction, FragranceReactionType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'

interface ReactToFragranceArgs {
  fragranceId: number
  reaction: FragranceReactionType

  myReaction: boolean | null
}

export const reactToFragrance = async (parent: undefined, args: ReactToFragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceReaction | null> => {
  const ctxUser = ctx.user

  if (!ctxUser) return null

  const { id: userId } = ctxUser
  const { fragranceId, reaction, myReaction = null } = args

  const query = `--sql
    WITH current_reaction AS (
      SELECT value
      FROM fragrance_reactions
      WHERE fragrance_id = $1 
        AND user_id = $4 
        AND reaction = $2 
        AND deleted_at IS NULL
    ),
    update_fragrance AS (
      UPDATE fragrances f
      SET
        likes_count = f.likes_count + 
          CASE
            WHEN $3 = true AND cr.value IS NULL THEN 1
            WHEN $3 = true AND cr.value IS DISTINCT FROM true THEN 1
            WHEN ($3 = false OR $3 IS NULL) AND cr.value = true THEN -1
            ELSE 0
          END,
        dislikes_count = f.dislikes_count + 
          CASE
            WHEN $3 = false AND cr.value IS NULL THEN 1
            WHEN $3 = false AND cr.value IS DISTINCT FROM false THEN 1
            WHEN ($3 = true OR $3 IS NULL) AND cr.value = false THEN -1
            ELSE 0
          END
      FROM (SELECT 1) dummy
      LEFT JOIN current_reaction cr ON true
      WHERE f.id = $1
      RETURNING f.id
    ),
    upsert_reaction AS (
      INSERT INTO fragrance_reactions (fragrance_id, reaction, user_id, value, deleted_at)
      VALUES ($1, $2, $4, $3, CASE WHEN $3 IS NULL THEN CURRENT_TIMESTAMP ELSE NULL END)
      ON CONFLICT (fragrance_id, reaction, user_id)
      DO UPDATE SET 
        value = EXCLUDED.value,
        deleted_at = CASE WHEN EXCLUDED.value IS NULL THEN CURRENT_TIMESTAMP ELSE NULL END
    )
    SELECT 
      $2 AS reaction, 
      $3 AS "myReaction"
  `
  const values = [fragranceId, reaction, myReaction, userId]

  const res = await ctx.pool.query<FragranceReaction>(query, values)

  const fragranceReaction = res.rows[0]

  return fragranceReaction
}
