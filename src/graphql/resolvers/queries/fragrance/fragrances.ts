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
  const user = ctx.user
  const limit = args.limit ?? 10
  const offset = args.offset ?? 0

  const fields = graphqlFields(info)
  const userId = user?.id

  const query = `--sql
    WITH fragrance_data AS (
      SELECT
        id,
        brand,
        name,
        rating,
        reviews_count,
        likes_count,
        dislikes_count
      FROM fragrances
      ORDER BY id
      LIMIT $1
      OFFSET $2
    ),
    user_vote AS (
      SELECT
        fragrance_id,
        vote
      FROM fragrance_votes
      WHERE user_id = $3
        AND deleted_at IS NULL
    )
    SELECT
      fd.id,
      fd.brand,
      fd.name,
      fd.rating,
      fd.reviews AS "reviewsCount",
      JSONB_BUILD_OBJECT(
        'id', fd.id,
        'likes', fd.likes_count, 
        'dislikes', fd.dislikes_count, 
        'myVote', CASE WHEN uv.vote = 1 THEN true WHEN uv.vote = -1 THEN false ELSE null END
      ) AS vote
    FROM fragrance_data fd
    LEFT JOIN user_vote uv ON uv.fragrance_id = fd.id 
    ORDER BY fd.id
  `
  const values = [limit, offset, userId]

  const result = await ctx.pool.query<Fragrance>(query, values)

  const fragrances = result.rows

  return fragrances
}
