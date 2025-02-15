import { Context } from '@src/graphql/schema/context'
import { FragranceReview } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'

interface ReviewFragranceArgs {
  fragranceId: number
  myRating: number
  myReview: string
}

export const reviewFragrance = async (_: undefined, args: ReviewFragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceReview | null> => {
  const user = ctx.user

  if (!user) {
    return null
  }

  const { fragranceId, myRating, myReview } = args
  const { id: userId } = user

  const query = `--sql
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
      ir.created_at AS "dCreated",
      ir.updated_at AS "dModified",
      ir.deleted_at AS "dDeleted",
      JSONB_BUILD_OBJECT('id', u.id, 'username', u.username) AS user
    FROM inserted_review ir
    JOIN users u ON u.id = ir.user_id
  `
  const values = [fragranceId, myRating, myReview, userId]

  const result = await ctx.pool.query<FragranceReview>(query, values)
  const review = result.rows[0]

  return review
}
