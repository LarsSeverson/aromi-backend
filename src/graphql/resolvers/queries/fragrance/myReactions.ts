import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceAccord, FragranceImage, MyFragranceReactions } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface MyReactionsFields {
  like: boolean
  dislike: boolean
}

const getSelect = (fields: MyReactionsFields): string => {
  let select = ''
  if (fields.like) {
    select += `EXISTS(
      SELECT 1 FROM fragrance_reactions 
      WHERE user_id = $2 
        AND fragrance_id = $1 
        AND reaction = 'like' 
        AND deleted_at IS NULL
    ) AS "like"`
  }
  if (fields.dislike) {
    if (select) select += ','
    select += `EXISTS(
      SELECT 1 FROM fragrance_reactions 
      WHERE user_id = $2 
        AND fragrance_id = $1 
        AND reaction = 'dislike' 
        AND deleted_at IS NULL
    ) AS "dislike"`
  }

  return select
}

export const myReactions = async (parent: Fragrance, args: undefined, ctx: Context, info: GraphQLResolveInfo): Promise<MyFragranceReactions | null> => {
  const user = ctx.user
  if (!user) {
    return { dislike: false, like: false }
  }

  const fragranceId = parent.id
  if (!fragranceId) return null

  const fields: MyReactionsFields = graphqlFields(info)
  const select = getSelect(fields)

  const query = `
    SELECT ${select}
  `
  const values = [fragranceId, user.id]

  const result = await ctx.pool.query(query, values)

  return result.rows[0]
}
