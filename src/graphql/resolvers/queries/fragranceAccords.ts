import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceAccordsArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id }: FragranceAccordsArgs = ctx.args

  const fields = ctx.stash.fields?.accords || ctx.info.selectionSetList
  if (!fields || fields.length === 0) {
    return null
  }

  const query = select({
    from: 'fragrance_accords_combined',
    columns: fields,
    where: { fragranceID: { eq: id } }
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

  const fragranceAccords = toJsonObject(result)[0]

  ctx.stash.accords = fragranceAccords

  return fragranceAccords
}
