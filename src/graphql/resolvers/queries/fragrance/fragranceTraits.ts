import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceTraitsArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id }: FragranceTraitsArgs = ctx.args

  const columns = ctx.info.selectionSetList

  const where = {
    fragranceId: { eq: id }
  }

  const query = select<any>({
    from: 'fragrance_traits_view',
    columns,
    where
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

  const traits = toJsonObject(result)[0]

  return traits
}
