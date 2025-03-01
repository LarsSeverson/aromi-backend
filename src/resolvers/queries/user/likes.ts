import { type Fragrance, type UserResolvers } from '@src/generated/gql-types'

const LIKES_QUERY = `--sql
  WITH fragrance_data AS (
    SELECT
      f.id,
      f.brand,
      f.name,
      f.rating,
      f.reviews_count,
      f.likes_count,
      f.dislikes_count
    FROM fragrances f
    WHERE f.id IN (
      SELECT fragrance_id
      FROM fragrance_votes
      WHERE user_id = $1
        AND vote = 1
        AND deleted_at IS NULL
    )
  ),
  user_vote AS (
    SELECT
      fragrance_id,
      vote,
      updated_at AS voteModified
    FROM fragrance_votes
    WHERE user_id = $1
      AND vote = 1
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
  ORDER BY uv.voteModified DESC
  LIMIT $2
  OFFSET $3
`

export const userLikes: UserResolvers['likes'] = async (parent, args, context, info) => {
  const { id } = parent
  const { pool } = context
  const { limit = 15, offset = 0 } = args

  const values = [id, limit, offset]
  const { rows } = await pool.query<Fragrance>(LIKES_QUERY, values)

  return rows
}
