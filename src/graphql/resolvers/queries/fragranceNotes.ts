import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select } from '@aws-appsync/utils/rds'

interface FragranceNotesArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id }: FragranceNotesArgs = ctx.args

  const fields = ctx.stash.fields?.notes || ctx.info.selectionSetList
  if (!fields || fields.length === 0) {
    return null
  }

  const query = select({
    from: 'fragrance_notes_combined',
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

  const fragranceNotes = toJsonObject(result)[0]

  ctx.stash.notes = fragranceNotes

  return fragranceNotes
}
