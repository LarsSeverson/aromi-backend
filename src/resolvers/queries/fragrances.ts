import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { sql, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds'
import { Fragrance } from './fragrance'

export type Fragrances = Fragrance[]

interface FragrancesArgs {
    limit: number | 10
    offset: number | 0
}

export const request = (ctx: Context): RDSRequest => {
  const { limit, offset }: FragrancesArgs = ctx.args

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

  return fragrances as Fragrances
}
