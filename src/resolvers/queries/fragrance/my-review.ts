import { type FragranceReview, type FragranceResolvers } from '@src/generated/gql-types'

const MY_REVIEW_QUERY = `--sql
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
  LEFT JOIN fragrance_review_votes rv ON rv.fragrance_review_id = fr.id
  WHERE fr.fragrance_id = $1 AND fr.user_id = $2
`

export const myReview: FragranceResolvers['myReview'] = async (parent, args, context, info) => {
  const { user, pool } = context

  if (user === undefined) return null

  const { id: fragranceId } = parent
  const { id: userId } = user

  const values = [fragranceId, userId]
  const { rows } = await pool.query<FragranceReview>(MY_REVIEW_QUERY, values)

  return rows.at(0) ?? null
}
