import { AppSyncIdentityCognito, Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, insert, sql, select } from '@aws-appsync/utils/rds'
import { FragranceReactionType } from '@src/graphql/types/fragranceTypes'

interface ReactToFragranceArgs {
 fragranceId: number

 reaction: FragranceReactionType
}

export const request = (ctx: Context): RDSRequest | null => {
  const { fragranceId, reaction }: ReactToFragranceArgs = ctx.args

  const cogId = (ctx.identity as AppSyncIdentityCognito).sub

  const query = sql`
    WITH user_info AS (
      SELECT id as user_id
      FROM users
      WHERE cognito_id = ${cogId}
      LIMIT 1
    )
    INSERT INTO fragrance_reactions_view ("fragranceId", "userId", reaction)
    SELECT
      ${fragranceId},
      (SELECT user_id FROM user_info),
      ${reaction}::fragrance_reaction 
    ON CONFLICT ("fragranceId", "userId", reaction) DO UPDATE SET
      "deletedAt" = CASE
        WHEN fragrance_reactions_view."deletedAt" IS NULL
        THEN CURRENT_TIMESTAMP
        ELSE NULL
      END,
      "updatedAt" = CURRENT_TIMESTAMP
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

  const reaction = toJsonObject(result)[0][0]

  return reaction
}
