import { Context } from '@src/context'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

interface FragrancesArgs {
  limit?: number
  offset?: number
}

export const fragrances = async (parent: undefined, args: FragrancesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<any> => {
  const limit = args.limit

  const res = await ctx.pool.query('SELECT * FROM fragrances LIMIT $1', [limit])
  const fragrances = res.rows

  return fragrances
}
