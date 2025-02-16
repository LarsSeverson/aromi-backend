import { Context } from '@src/graphql/schema/context'
import { FragranceReview } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'

interface VoteOnReviewArgs {
  reviewId: number
  myVote: boolean | null
}

export const voteOnReview = async (parent: undefined, args: VoteOnReviewArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceReview | null> => {
  const ctxUser = ctx.user

  if (!ctxUser) return null

  const { id: userId } = ctxUser
  const { reviewId, myVote } = args

  const query = `--sql
    WITH old AS (
      SELECT (
        SELECT vote AS old_vote
        FROM fragrance_review_votes
        WHERE fragrance_review_id = $1
          AND user_id = $3
          AND deleted_at IS NULL
        LIMIT 1
      ) AS old_vote
    ),
    update_review AS (
      UPDATE fragrance_reviews fr 
      SET votes = fr.votes + (
        (CASE WHEN $2 = true THEN 1 WHEN $2 = false THEN -1 ELSE 0 END)
        - COALESCE(old.old_vote, 0)
      )
      FROM old
      WHERE fr.id = $1
      RETURNING *
    ),
    upsert_vote AS (
      INSERT INTO fragrance_review_votes (fragrance_review_id, vote, user_id, deleted_at)
      VALUES (
        $1,
        CASE WHEN $2 IS NULL THEN 0 WHEN $2 = true THEN 1 ELSE -1 END,
        $3,
        CASE WHEN $2 IS NULL THEN now() ELSE NULL END
      )
      ON CONFLICT (fragrance_review_id, user_id)
      DO UPDATE SET
        vote = EXCLUDED.vote,
        deleted_at = CASE WHEN $2 IS NULL THEN now() ELSE NULL END
      RETURNING vote
    )
    SELECT
      ur.id,
      ur.rating,
      ur.votes,
      ur.review_text AS review,
      ur.created_at AS "dCreated",
      ur.updated_at AS "dModified",
      ur.deleted_at AS "dDeleted",
      JSONB_BUILD_OBJECT('id', u.id, 'username', u.username) AS user,
      $2 AS "myVote"
    FROM update_review ur
    JOIN users u ON u.id = ur.user_id
  `
  const values = [reviewId, myVote, userId]
  const result = await ctx.pool.query<FragranceReview>(query, values)
  const fragranceTrait = result.rows[0]

  return fragranceTrait
}
