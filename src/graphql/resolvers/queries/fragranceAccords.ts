import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceAccordsArgs {
  id: number
  name: string
  limit: number
  offset: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id, name, limit = 8, offset = 0 }: FragranceAccordsArgs = ctx.args

  if (ctx.source?.accords) {
    return runtime.earlyReturn(JSON.parse(ctx.source.accords))
  }

  const columns = ctx.info.selectionSetList

  const where = {
    fragranceId: { eq: id },
    ...(name ? { name: { contains: name } } : {})
  }

  const query = select<any>({
    from: 'fragrance_accords_combined',
    columns,
    where,
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

  const accords = toJsonObject(result)[0]

  return accords
}
