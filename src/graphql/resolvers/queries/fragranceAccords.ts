import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceAccordsArgs {
  id: number
  limit: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id, limit = 8 }: FragranceAccordsArgs = { id: ctx.args.id || ctx.source.id, limit: ctx.args.limit }

  if (ctx.source.accords) {
    return runtime.earlyReturn(JSON.parse(ctx.source.accords))
  }

  const columns = ctx.info.selectionSetList

  const query = select<any>({
    from: 'fragrance_accords_combined',
    columns,
    where: { fragranceId: { eq: id } },
    limit
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

  const accords = toJsonObject(result)[0]

  return accords
}
