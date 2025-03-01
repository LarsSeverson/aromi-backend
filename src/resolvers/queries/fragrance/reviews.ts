import { type FragranceResolvers, type FragranceReview } from '@src/generated/gql-types'

const REVIEWS_QUERY = `--sql
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
  LEFT JOIN fragrance_review_votes rv ON rv.fragrance_review_id = fr.id AND rv.user_id = $4
  WHERE fragrance_id = $1
  ORDER BY fr.votes DESC
  LIMIT $2
  OFFSET $3
`

export const reviews: FragranceResolvers['reviews'] = async (parent, args, context, info) => {
  const { id } = parent
  const { user, pool } = context
  const { limit = 15, offset = 0 } = args

  const values = [id, limit, offset, user?.id]
  const { rows } = await pool.query<FragranceReview>(REVIEWS_QUERY, values)

  return rows
}
