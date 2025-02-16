import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceReview } from '@src/graphql/types/fragranceTypes'
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

interface FragranceReviewsArgs {
  limit?: number | undefined
  offset?: number | undefined
}

export const reviews = async (parent: Fragrance, args: FragranceReviewsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceReview[] | null> => {
  const fragranceId = parent.id
  const { limit = 15, offset = 0 } = args

  if (!fragranceId) return null

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
      JSONB_BUILD_OBJECT('id', u.id, 'username', u.username) AS user,
      CASE WHEN rv.vote = 1 THEN true WHEN rv.vote = -1 THEN false ELSE null END AS "myVote"
    FROM fragrance_reviews fr
    JOIN users u ON u.id = fr.user_id
    JOIN fragrance_review_votes rv ON rv.review_id = fr.id
    WHERE fragrance_id = $1
    LIMIT $2
    OFFSET $3
  `
  const values = [fragranceId, limit, offset]
  const result = await ctx.pool.query<FragranceReview>(query, values)
  const reviews = result.rows

  return reviews
}
