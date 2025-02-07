import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceAccord, FragranceImage, MyFragranceReactions } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface MyReactionsFields {
  like: boolean
  dislike: boolean
}

export const myReactions = async (parent: Fragrance, args: undefined, ctx: Context, info: GraphQLResolveInfo): Promise<MyFragranceReactions | null> => {
  const user = ctx.user
  if (!user) {
    return { like: false }
  }

  const fragranceId = parent.id
  if (!fragranceId) return null
  const userId = user.id

  const fields: MyReactionsFields = graphqlFields(info)

  const query = `--sql
    SELECT
      COALESCE((
        SELECT
          bool_or(value)
          FROM fragrance_reactions
          WHERE fragrance_id = $1
            AND user_id = $2
            AND reaction = 'like'
            AND deleted_at IS NULL
      ), NULL) as like
  `
  const values = [fragranceId, userId]

  const result = await ctx.pool.query(query, values)

  return result.rows[0]
}
