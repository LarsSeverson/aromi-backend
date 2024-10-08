import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { sql, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds'
import { Fragrance } from './fragrance'

interface FragrancesArgs {
  limit?: number
  offset?: number
}

export const request = (ctx: Context): RDSRequest => {
  const { limit = 30, offset = 0 }: FragrancesArgs = ctx.args

  const query = sql`SELECT * FROM fragrances LIMIT ${limit} OFFSET ${offset}`

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

  const fragrances = toJsonObject(result)[0]

  ctx.stash.fragrances = fragrances

  return fragrances
}
