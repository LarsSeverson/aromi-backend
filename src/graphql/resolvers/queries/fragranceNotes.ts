import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select, sql } from '@aws-appsync/utils/rds'
import { NoteLayer } from '@src/graphql/types/fragranceTypes'

interface FragranceNotesArgs {
  id: number
  name: string
  layer: NoteLayer
  limit: number
  offset: number
  fill: boolean
}

export const request = (ctx: Context): RDSRequest | null => {
  const { id, name, layer, limit = 8, offset = 0, fill = false }: FragranceNotesArgs = ctx.args

  if (ctx.source?.notes) {
    return runtime.earlyReturn(JSON.parse(ctx.source.notes))
  }

  const columns = ctx.info.selectionSetList

  const fillFilter = fill
    ? {
        or: [
          { layer: { eq: layer } },
          { layer: { eq: 'fill' } }
        ]
      }
    : { layer: { eq: layer } }

  const where = {
    and: [
      { fragranceId: { eq: id } },
      fillFilter
    ],
    ...(name ? { name: { contains: name } } : {})
  }

  const query = select<any>({
    from: `fragrance_notes_${layer}_layer`,
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

  const notes = toJsonObject(result)[0]

  return notes
}
