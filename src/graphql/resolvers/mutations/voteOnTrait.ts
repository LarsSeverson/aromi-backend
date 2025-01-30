import { AppSyncIdentityCognito, Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, sql } from '@aws-appsync/utils/rds'
import { FragranceTraitType } from '@src/graphql/types/fragranceTypes'

interface VoteOnTraitArgs {
  fragranceId: number
  value: number

  trait: FragranceTraitType
}

export const request = (ctx: Context): RDSRequest | null => {
  const { fragranceId, trait, value }: VoteOnTraitArgs = ctx.args

  const cogId = (ctx.identity as AppSyncIdentityCognito).sub

  const query = sql`
    WITH user_info AS (
      SELECT id as user_id
      FROM users
      WHERE cognito_id = ${cogId}
      LIMIT 1
    ),
    fragrance_trait AS (
      INSERT INTO fragrance_traits (fragrance_id, trait)
      VALUES (${fragranceId}, ${trait}::fragrance_trait)
      ON CONFLICT (fragrance_id, trait) DO NOTHING
      RETURNING id
    ),
    final_trait_id AS (
      SELECT COALESCE(
        (SELECT id FROM fragrance_trait),
        (SELECT id FROM fragrance_traits 
          WHERE fragrance_id = ${fragranceId} AND trait = ${trait}::fragrance_trait)
      ) AS trait_id
    )
    INSERT INTO fragrance_trait_votes (fragrance_trait_id, user_id, value)
    SELECT
      (SELECT trait_id FROM final_trait_id),
      (SELECT user_id FROM user_info),
      ${value}
    ON CONFLICT (fragrance_trait_id, user_id) DO UPDATE SET
    value = EXCLUDED.value
    RETURNING *
  `

  return createPgStatement(query)
}

export const response = (ctx: Context): any => {
  const { error, result } = ctx

  if (error) {
    return util.appendError(
      error.message,
      error.type,
      result
    )
  }

  const vote = toJsonObject(result)[0][0]

  const formattedVote = {
    ...vote,
    userId: vote.user_id,
    fragranceTraitId: vote.fragrance_trait_id
  }

  return formattedVote
}
