import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest | never => {
  const { id }: FragranceArgs = ctx.args

  const fields = ctx.stash.fields?.fragrance || ctx.info.selectionSetList
  if (!fields || fields.length === 0) {
    return runtime.earlyReturn({ fragrance: null })
  }

  const query = select({
    from: 'fragrances_view',
    columns: fields,
    where: { id: { eq: id } }
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

  const fragrance = toJsonObject(result)[0][0]

  return { fragrance }
}
