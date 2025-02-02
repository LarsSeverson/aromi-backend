import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'
import { graphqlFields } from '@src/graphql/utils/graphqlFields'

interface FragrancesArgs {
  limit?: number
  offset?: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const fieldName = ctx.info.fieldName
  const fields = graphqlFields(ctx.info.selectionSetList, fieldName)
  const columns = fields[fieldName]

  const { limit = 10, offset = 0 }: FragrancesArgs = ctx.args

  if (!fields || columns.length === 0) {
    return runtime.earlyReturn()
  }

  const query = select({
    from: 'fragrances_view',
    columns,
    limit,
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

  return fragrances
}
