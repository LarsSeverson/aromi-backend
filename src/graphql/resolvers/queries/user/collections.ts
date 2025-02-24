import { Context } from '@src/graphql/schema/context'
import { UserCollection } from '@src/graphql/types/userTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

interface CollectionsArgs {
  userId: number
  limit?: number | undefined
  offset?: number | undefined
}

export const collections = async (_: undefined, args: CollectionsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<UserCollection[]> => {
  const { userId, limit, offset } = args
  const fields = graphqlFields(info)

  const query = `--sql
    SELECT 
      id,
      name
    FROM user_collections
    WHERE user_id = $1
    LIMIT $2
    OFFSET $3
  `
  const values = [userId, limit, offset]

  const { rows: collections } = await ctx.pool.query<UserCollection>(query, values)

  return collections
}
