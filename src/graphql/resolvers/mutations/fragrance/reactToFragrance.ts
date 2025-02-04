import { Context } from '@src/graphql/schema/context'
import { FragranceReaction, FragranceReactionType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'

interface ReactToFragranceArgs {
  fragranceId: number
  reaction: FragranceReactionType

  myReaction: boolean
}

export const reactToFragrance = async (parent: undefined, args: ReactToFragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceReaction | null> => {
  const ctxUser = ctx.user

  if (!ctxUser) return null

  const { id: userId } = ctxUser
  const { fragranceId, reaction, myReaction } = args

  const reactionColumn = `${reaction}s_count`

  const query = `--sql
    WITH updated AS (
      UPDATE fragrances
      SET ${reactionColumn} = ${reactionColumn} + 
        (CASE
          WHEN COALESCE(
            (SELECT (deleted_at IS NULL) FROM fragrance_reactions
            WHERE fragrance_id = $1 AND user_id = $4),
            false
          ) <> $3 THEN
            CASE WHEN $3 IS FALSE THEN -1 ELSE 1 END
          ELSE 0
        END)
      WHERE id = $1
    ),
    reaction AS (
      INSERT INTO fragrance_reactions (fragrance_id, reaction, user_id)
      VALUES ($1, $2, $4)
      ON CONFLICT (fragrance_id, reaction, user_id)
      DO UPDATE SET deleted_at = 
        CASE 
          WHEN (fragrance_reactions.deleted_at IS NULL AND $3 IS FALSE) THEN CURRENT_TIMESTAMP
          WHEN (fragrance_reactions.deleted_at IS NOT NULL AND $3 IS TRUE) THEN NULL
          ELSE fragrance_reactions.deleted_at
        END
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
