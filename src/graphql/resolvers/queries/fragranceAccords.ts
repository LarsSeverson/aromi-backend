import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { sql, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds'

interface FragranceAccordsArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest => {
  const { id }: FragranceAccordsArgs = ctx.args

  const query = sql`
    SELECT
      fa."fragranceID",
      fa."accordID",
      a.name,
      fa.concentration
    FROM fragrance_accords_view fa
    JOIN accords a ON fa."accordID" = a.id
    WHERE fa."fragranceID" = ${id}
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

  const fragranceAccords = toJsonObject(result)[0]

  ctx.stash.accords = fragranceAccords

  return fragranceAccords
}
