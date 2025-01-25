import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, sql } from '@aws-appsync/utils/rds'
import { graphqlFields } from '@src/graphql/utils/graphqlFields'

interface FragranceAccordUserVotesArgs {
  userId: number
  limit?: number | undefined
  offset?: number | undefined

  fragranceAccordIds: number[]
}

export const request = (ctx: Context): RDSRequest | null => {
  const fieldName = ctx.info.fieldName
  const fields = graphqlFields(ctx.info.selectionSetList, fieldName)
  const columns = fields[fieldName]

  const { userId, limit = 50, offset = 0, fragranceAccordIds }: FragranceAccordUserVotesArgs = ctx.args

  if (!fields || columns.length === 0) {
    return runtime.earlyReturn(null)
  }

  const accordIds = fragranceAccordIds.join(',')

  const query = sql`
    SELECT fav.*
    FROM fragrance_accord_votes_view fav
    WHERE fav."userId" = ${userId}
    AND fav."fragranceAccordId" = ANY(STRING_TO_ARRAY(${accordIds}, ',')::INTEGER[]) 
    LIMIT ${limit}
    OFFSET ${offset}
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
