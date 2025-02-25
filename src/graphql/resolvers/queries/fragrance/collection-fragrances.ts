import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceCollection } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

interface CollectionFragrancesArgs {
  limit: number
  offset: number
}

export const collectionFragrances = async (parent: FragranceCollection, args: CollectionFragrancesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance[] | null> => {
  const { id: collectionId } = parent
  const { limit, offset } = args
  const user = ctx.user
  const userId = user?.id

  const query = `--sql
    SELECT
      f.id,
      f.brand,
      f.name,
      COALESCE(f.rating, 0) AS rating,
      f.reviews_count AS "reviewsCount",
      JSONB_BUILD_OBJECT(
        'id', f.id,
        'likes', f.likes_count,
        'dislikes', f.dislikes_count,
        'myVote', CASE
                    WHEN fv.vote = 1 THEN true
                    WHEN fv.vote = -1 THEN false
                    ELSE null
                  END
      ) AS vote
    FROM collection_fragrances cf
    JOIN fragrances f on f.id = cf.fragrance_id
    LEFT JOIN fragrance_votes fv ON fv.fragrance_id = f.id
      AND fv.user_id = $4
      AND fv.deleted_at IS NULL
    WHERE cf.collection_id = $1
    LIMIT $2
    OFFSET $3
  `
  const values = [collectionId, limit, offset, userId]
  const { rows } = await ctx.pool.query<Fragrance>(query, values)

  return rows
}
