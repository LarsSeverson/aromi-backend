import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceNotesArgs {
  id: number
  limit: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id, limit = 8 }: FragranceNotesArgs = { id: ctx.args.id || ctx.source.id, limit: ctx.args.limit }

  if (ctx.source.notes) {
    return runtime.earlyReturn(JSON.parse(ctx.source.notes))
  }

  const columns = ctx.info.selectionSetList

  const query = select<any>({
    from: 'fragrance_notes_combined',
    columns,
    where: { fragranceID: { eq: id } },
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

  const notes = toJsonObject(result)[0]

  return notes
}
