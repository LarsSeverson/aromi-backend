import { Context } from '@src/graphql/schema/context'
import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface FragranceReactionsFields {
  likes: boolean
  dislikes: boolean
  reviews: boolean
}

export interface FragranceFields {
  id: boolean
  brand: boolean
  name: boolean

  reactions: FragranceReactionsFields
}

export interface MyReactionsFields {
  reaction: boolean
}

interface FragrancesArgs {
  limit?: number | undefined
  offset?: number | undefined
}

export const fragrances = async (_: undefined, args: FragrancesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance[] | null> => {
  const limit = args.limit ?? 10
  const offset = args.offset ?? 0

  const fields = graphqlFields(info)

  const query = `--sql
    SELECT
      f.id,
      f.brand,
      f.name,
      JSONB_BUILD_OBJECT(
        'id', f.id,
        'likes', f.likes_count,
        'dislikes', f.dislikes_count,
        'reviews', f.reviews_count,
        'rating', f.rating
      ) AS reactions
    FROM fragrances f
    ORDER BY id
    LIMIT $1
    OFFSET $2
  `
  const values = [limit, offset]

  const result = await ctx.pool.query<Fragrance>(query, values)

  const fragrances = result.rows

  return fragrances
}
