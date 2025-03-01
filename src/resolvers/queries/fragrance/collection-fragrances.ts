import { type Fragrance, type FragranceCollectionResolvers } from '@src/generated/gql-types'

const COLLECTION_FRAGRANCES_QUERY = `--sql
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

export const collectionFragrances: FragranceCollectionResolvers['fragrances'] = async (parent, args, context, info) => {
  const { id } = parent
  const { user, pool } = context
  const { limit = 10, offset = 0 } = args

  const values = [id, limit, offset, user?.id]
  const { rows } = await pool.query<Fragrance>(COLLECTION_FRAGRANCES_QUERY, values)

  return rows
}
