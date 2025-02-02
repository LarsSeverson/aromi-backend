import { AppSyncIdentityCognito, Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select, sql } from '@aws-appsync/utils/rds'

interface FragranceTraitVotesArgs {
  fragranceId: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { fragranceId }: FragranceTraitVotesArgs = ctx.args

  const columns = ctx.info.selectionSetList.join(',')

  const cogId = (ctx.identity as AppSyncIdentityCognito).sub

  const query = sql`
    WITH user_info AS (
      SELECT id as user_id
      FROM users
      WHERE cognito_id = ${cogId}
      LIMIT 1
    )
    SELECT * FROM fragrance_trait_votes_view, user_info
    WHERE "fragranceId" = ${fragranceId} AND "userId" = user_info.user_id
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

  const votes = toJsonObject(result)[0]

  return votes
}
