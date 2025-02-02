import { AppSyncIdentityCognito, Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, insert, sql, select } from '@aws-appsync/utils/rds'

interface VoteOnAccordArgs {
 fragranceId: number
 accordId: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { fragranceId, accordId }: VoteOnAccordArgs = ctx.args

  const cogId = (ctx.identity as AppSyncIdentityCognito).sub

  const query = sql`
    WITH user_info AS (
      SELECT id as user_id
      FROM users
      WHERE cognito_id = ${cogId}
      LIMIT 1
    ),
    fragrance_accord AS (
      INSERT INTO fragrance_accords (fragrance_id, accord_id)
      VALUES (${fragranceId}, ${accordId})
      ON CONFLICT (fragrance_id, accord_id) DO NOTHING
      RETURNING id
    ),
    final_accord_id AS (
      SELECT COALESCE(
        (SELECT id FROM fragrance_accord),
        (SELECT id FROM fragrance_accords 
          WHERE fragrance_id = ${fragranceId} AND accord_id = ${accordId})
      ) AS accord_id
    )
    INSERT INTO fragrance_accord_votes_view ("fragranceAccordId", "userId")
    SELECT
      (SELECT accord_id FROM final_accord_id),
      (SELECT user_id FROM user_info)
    ON CONFLICT ("fragranceAccordId", "userId") DO UPDATE SET
      "deletedAt" = CASE
        WHEN fragrance_accord_votes_view."deletedAt" IS NULL
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

  const vote = toJsonObject(result)[0][0]

  return vote
}
