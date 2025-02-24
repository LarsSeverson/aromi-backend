import { Context } from '@src/graphql/schema/context'
import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface FragranceFields {
  id: boolean
  brand: boolean
  name: boolean

  reactions: boolean
}

interface FragranceArgs {
  id: number
}

export const fragrance = async (_: undefined, args: FragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance | null> => {
  const user = ctx.user
  const { id } = args

  if (!id) {
    return null
  }

  const fields: FragranceFields = graphqlFields(info)
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
      WHERE id = $1
    ),
    user_vote AS (
      SELECT
        id,
        vote
      FROM fragrance_votes
      WHERE fragrance_id = $1
        AND user_id = $2
        AND deleted_at IS NULL
      LIMIT 1
    )
    SELECT
      fd.id,
      fd.brand,
      fd.name,
      COALESCE(fd.rating, 0) AS rating,
      fd.reviews_count AS "reviewsCount",
      JSONB_BUILD_OBJECT(
        'id', fd.id,
        'likes', fd.likes_count, 
        'dislikes', fd.dislikes_count, 
        'myVote', CASE WHEN uv.vote = 1 THEN true WHEN uv.vote = -1 THEN false ELSE null END
      ) AS vote
    FROM fragrance_data fd
    LEFT JOIN user_vote uv ON TRUE
  `
  const values = [id, userId]

  const result = await ctx.pool.query<Fragrance>(query, values)

  const fragrance = result.rows[0]

  return fragrance
}
