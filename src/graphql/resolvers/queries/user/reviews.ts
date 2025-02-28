import { Context } from '@src/graphql/schema/context'
import { FragranceReview } from '@src/graphql/types/fragranceTypes'
import { User } from '@src/graphql/types/userTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface ReviewsFields {
  id: Record<string, unknown>
  rating: Record<string, unknown>
  text: Record<string, unknown>
  dCreated: Record<string, unknown>
  dModified: Record<string, unknown>
  dDeleted: Record<string, unknown>
}

interface UserReviewsArgs {
  limit?: number | undefined
  offset?: number | undefined
}

export const userReviews = async (parent: User, args: UserReviewsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceReview[] | null> => {
  const { id } = parent
  const { limit = 15, offset = 0 } = args

  const fields: ReviewsFields = graphqlFields(info)

  const query = `--sql
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
  const values = [id, limit, offset]
  const { rows } = await ctx.pool.query<FragranceReview>(query, values)

  return rows
}
