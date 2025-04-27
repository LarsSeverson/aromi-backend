import { type FragranceReview, type MutationResolvers } from '@src/generated/gql-types'

const REVIEW_FRAGRANCE_QUERY = /* sql */`
  WITH inserted_review AS (
    INSERT INTO fragrance_reviews (fragrance_id, rating, review_text, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (fragrance_id, user_id) DO UPDATE SET
      rating = $2,
      review_text = $3,
      updated_at = NOW()
    RETURNING 
      id, 
      user_id,
      fragrance_id,
      rating, 
      review_text, 
      votes,
      created_at, 
      updated_at, 
      deleted_at, 
      xmax
  ),
  update_fragrance AS (
    UPDATE fragrances f
    SET reviews_count = reviews_count + 1
    FROM inserted_review ir
    WHERE f.id = ir.fragrance_id AND ir.xmax = 0
  )
  SELECT 
    ir.id,
    ir.rating,
    ir.review_text AS review,
    ir.votes,
    ir.created_at AS "dCreated",
    ir.updated_at AS "dModified",
    ir.deleted_at AS "dDeleted",
    JSONB_BUILD_OBJECT('id', u.id, 'username', u.username) AS user,
    CASE WHEN rv.vote = 1 THEN true WHEN rv.vote = -1 THEN false ELSE null END AS "myVote"
  FROM inserted_review ir
  JOIN users u ON u.id = ir.user_id
  LEFT JOIN fragrance_review_votes rv ON rv.fragrance_review_id = ir.id AND rv.user_id = $4
`

export const reviewFragrance: MutationResolvers['reviewFragrance'] = async (parent, args, context, info) => {
  const { me: user, sources } = context
  const { db } = sources

  if (user === undefined) {
    return null
  }

  const { fragranceId, myRating, myReview } = args
  const values = [fragranceId, myRating, myReview, user.id]
  const { rows } = await db.query<FragranceReview>(REVIEW_FRAGRANCE_QUERY, values)

  return rows.at(0) ?? null
}
