import { Context, RDSRequest, util, runtime } from '@aws-appsync/utils'
import { createPgStatement, toJsonObject, select, sql } from '@aws-appsync/utils/rds'
import { FragranceReactionType } from '@src/graphql/types/fragranceTypes'

interface FragranceReactionsArgs {
  fragranceId: number
  userId: number

  reaction?: FragranceReactionType
}

export const request = (ctx: Context): RDSRequest | null => {
  const { fragranceId, userId, reaction }: FragranceReactionsArgs = ctx.args

  const query = sql`
    SELECT * FROM fragrance_reactions_view
    WHERE "fragranceId" = ${fragranceId} AND "userId" = ${userId} AND reaction = ${reaction}::fragrance_reaction
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

  const votes = toJsonObject(result)[0]

  return votes
}
