import { Context } from '@src/graphql/schema/context'
import { User } from '@src/graphql/types/userTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import { FragranceCollection } from '@src/graphql/types/fragranceTypes'

interface CollectionsArgs {
  limit?: number | undefined
  offset?: number | undefined
}

export const collections = async (parent: User, args: CollectionsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceCollection[]> => {
  const { id } = parent
  const { limit, offset } = args
  const fields = graphqlFields(info)

  const query = `--sql
    SELECT
      id,
      name
    FROM fragrance_collections
    WHERE user_id = $1
    LIMIT $2
    OFFSET $3
  `
  const values = [id, limit, offset]
  const { rows } = await ctx.pool.query<FragranceCollection>(query, values)

  return rows
}
