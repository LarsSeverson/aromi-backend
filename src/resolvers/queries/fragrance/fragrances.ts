import { type Fragrance, type QueryResolvers } from '@src/generated/gql-types'

const FRAGRANCES_QUERY = `--sql
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
    COALESCE(fd.rating, 0) AS rating,
    fd.reviews_count AS "reviewsCount",
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

export const fragrances: QueryResolvers['fragrances'] = async (parent, args, context, info) => {
  const { limit = 10, offset = 0 } = args
  const { user, pool } = context

  const values = [limit, offset, user?.id]
  const { rows } = await pool.query<Fragrance>(FRAGRANCES_QUERY, values)

  return rows
}
