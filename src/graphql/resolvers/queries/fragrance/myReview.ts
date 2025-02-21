import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceReview } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface MyReviewFields {
  id: Record<string, unknown>
  rating: Record<string, unknown>
  text: Record<string, unknown>
  dCreated: Record<string, unknown>
  dModified: Record<string, unknown>
  dDeleted: Record<string, unknown>
}

export const myReview = async (parent: Fragrance, _: undefined, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceReview | null> => {
  const user = ctx.user

  if (!user) return null

  const { id: fragranceId } = parent
  const { id: userId } = user
  const fields: MyReviewFields = graphqlFields(info)

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
    LEFT JOIN fragrance_review_votes rv ON rv.fragrance_review_id = fr.id
    WHERE fr.fragrance_id = $1 AND fr.user_id = $2
  `
  const values = [fragranceId, userId]

  const result = await ctx.pool.query<FragranceReview>(query, values)
  const myReview = result.rows[0]

  return myReview
}
