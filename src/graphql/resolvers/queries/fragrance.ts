import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { sql, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds'

interface FragranceArgs {
  id: number
}

export const request = (ctx: Context): RDSRequest => {
  const { id }: FragranceArgs = ctx.args

  const query = sql`SELECT * FROM fragrances_view WHERE id = ${id}`

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

  ctx.stash.fragrance = fragrance

  return fragrance
}
