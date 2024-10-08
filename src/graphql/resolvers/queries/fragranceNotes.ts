import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { sql, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds'
import { FragranceNote } from './fragranceNote'

export type FragranceNotes = FragranceNote[]

interface FragranceNotesArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest => {
  const { id }: FragranceNotesArgs = ctx.args

  const query = sql`
    SELECT 
        fn."fragranceID",
        fn."noteID",
        n.name,
        fn.type,
        fn.concentration
    FROM "fragranceNotes" fn
    JOIN notes n ON fn."noteID" = n.id
    WHERE fn."fragranceID" = ${id}
  `

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

  return fragranceNotes as FragranceNotes
}
