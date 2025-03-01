import { type FragranceReview, type UserResolvers } from '@src/generated/gql-types'

const USER_REVIEWS_QUERY = `--sql
  SELECT
    fr.id,
    fr.rating,
    fr.votes,
    fr.review_text AS review,
    fr.created_at AS "dCreated",
    fr.updated_at AS "dModified",
    fr.deleted_at AS "dDeleted",
    u.username AS author,
    CASE WHEN rv.vote = 1 THEN true WHEN rv.vote = -1 THEN false ELSE null END AS "myVote"
  FROM fragrance_reviews fr
  JOIN users u ON u.id = fr.user_id
  LEFT JOIN fragrance_review_votes rv ON rv.fragrance_review_id = fr.id AND rv.user_id = $1
  WHERE fr.user_id = $1
  ORDER BY fr.updated_at DESC
  LIMIT $2
  OFFSET $3
`

export const userReviews: UserResolvers['reviews'] = async (parent, args, context, info) => {
  const { id } = parent
  const { pool } = context
  const { limit = 15, offset = 0 } = args

  const values = [id, limit, offset]
  const { rows } = await pool.query<FragranceReview>(USER_REVIEWS_QUERY, values)

  return rows
}
