import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, insert, sql, select } from '@aws-appsync/utils/rds'

interface VoteOnAccordArgs {
 fragranceAccordId: number
 userId: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { fragranceAccordId, userId }: VoteOnAccordArgs = ctx.args

  const query = sql`
    INSERT INTO fragrance_accord_votes_view ("fragranceAccordId", "userId")
    VALUES (${fragranceAccordId}, ${userId})
    ON CONFLICT ("fragranceAccordId", "userId")
    DO UPDATE SET "deletedAt" = CASE
      WHEN fragrance_accord_votes_view."deletedAt" IS NULL THEN CURRENT_TIMESTAMP
      ELSE NULL
    END
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
