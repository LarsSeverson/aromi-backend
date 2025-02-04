import { Context } from '@src/graphql/schema/context'
import { FragranceTrait, FragranceTraitType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'

interface VoteOnTraitArgs {
  fragranceId: number
  trait: FragranceTraitType

  myVote: number
}

export const voteOnTrait = async (parent: undefined, args: VoteOnTraitArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceTrait | null> => {
  const ctxUser = ctx.user

  if (!ctxUser) return null

  const { id: userId } = ctxUser
  const { fragranceId, trait, myVote } = args

  const query = `--sql
    WITH inserted AS (
      INSERT INTO fragrance_traits (fragrance_id, trait, value)
      VALUES ($1, $2, $3)
      ON CONFLICT (fragrance_id, trait)
      DO NOTHING 
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
      $2 AS trait,
      value,
      $3 AS "myVote"
    FROM inserted
  `
  const values = [fragranceId, trait, myVote, userId]

  const res = await ctx.pool.query<FragranceTrait>(query, values)

  const fragranceTrait = res.rows[0]

  return fragranceTrait
}
