import { type Fragrance, type QueryResolvers } from '@src/generated/gql-types'

const FRAGRANCE_QUERY = /* sql */`
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
    ) AS votes
  FROM fragrance_data fd
  LEFT JOIN user_vote uv ON TRUE
`

export const fragrance: QueryResolvers['fragrance'] = async (parent, args, context, info) => {
  const { id } = args
  const { me: user, sources } = context
  const userId = user?.id

  const values = [id, userId]
  const { rows } = await sources.db.query<Fragrance>(FRAGRANCE_QUERY, values)

  return rows.at(0) ?? null
}
