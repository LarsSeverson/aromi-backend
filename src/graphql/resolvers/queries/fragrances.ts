import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'
import { graphqlFields } from '@src/graphql/utils/graphqlFields'

interface FragrancesArgs {
  limit?: number
  offset?: number
}

export const request = (ctx: Context): RDSRequest => {
  const { limit = 30, offset = 0 }: FragrancesArgs = ctx.args

  const query = select({
    table: 'fragrances_view',
    limit,
    columns: ctx.info.selectionSetList,
    offset
  })

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

  const fragrances = toJsonObject(result)[0]

  ctx.stash.fragrances = fragrances

  return fragrances
}
