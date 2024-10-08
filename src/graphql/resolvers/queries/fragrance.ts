import { Context, RDSRequest, util } from '@aws-appsync/utils'
import { sql, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds'
import { FragranceAccords } from './fragranceAccords'
import { FragranceNotes } from './fragranceNotes'

export interface Fragrance {
    id: number
    brand: string
    name: string
    rating: number
    reviewCount: number
    likes: number
    dislikes: number
    gender: number
    longevity: number
    sillage: number
    complexity: number
    balance: number
    allure: number
}

interface FragranceArgs {
    id: number
}

export const request = (ctx: Context): RDSRequest => {
  const { id }: FragranceArgs = ctx.args

  const query = sql`SELECT * FROM fragrances WHERE id = ${id}`

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
