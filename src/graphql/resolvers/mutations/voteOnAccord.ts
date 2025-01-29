import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, insert, sql, select } from '@aws-appsync/utils/rds'

interface VoteOnAccordArgs {
 fragranceId: number
 accordId: number
 userId: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { fragranceId, accordId, userId }: VoteOnAccordArgs = ctx.args

  const query = sql`
    WITH fragrance_accord_cte AS (
    INSERT INTO fragrance_accords (fragrance_id, accord_id)
    SELECT ${fragranceId}, ${accordId} 
    WHERE NOT EXISTS (
        SELECT 1 FROM fragrance_accords 
        WHERE fragrance_id = ${fragranceId} 
          AND accord_id = ${accordId}
    )
    RETURNING id
    ), fragrance_accord_id AS (
        SELECT id FROM fragrance_accords 
        WHERE fragrance_id = ${fragranceId}
          AND accord_id = ${accordId}
        UNION ALL
        SELECT id FROM fragrance_accord_cte
    )
    INSERT INTO fragrance_accord_votes_view ("fragranceAccordId", "userId")
    SELECT id, ${userId} FROM fragrance_accord_id
    ON CONFLICT ("fragranceAccordId", "userId")
    DO UPDATE SET "deletedAt" = CASE 
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
