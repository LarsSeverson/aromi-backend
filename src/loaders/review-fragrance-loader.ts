import { type ApiDataSources } from '@src/datasources'
import { type Fragrance } from '@src/generated/gql-types'
import DataLoader from 'dataloader'

const BASE_QUERY = /* sql */`
  SELECT
    fr.id AS "reviewId",
    f.id,
    f.brand,
    f.name,
    COALESCE(f.rating, 0) AS rating,
    f.reviews_count AS "reviewsCount",
    JSONB_BUILD_OBJECT(
      'id', f.id,
      'likes', f.likes_count,
      'dislikes', f.dislikes_count,
      'myVote', CASE WHEN fv.vote = 1 THEN true WHEN fv.vote = -1 THEN false ELSE null END
    ) AS votes
  FROM fragrance_reviews fr
  JOIN fragrances f ON f.id = fr.fragrance_id
  LEFT JOIN fragrance_votes fv ON fv.fragrance_id = f.id AND fv.user_id = $2 AND fv.deleted_at IS NULL
  WHERE fr.id = ANY($1)
`

export interface ReviewFragranceKey {
  reviewId: number
  myUserId: number | undefined
}

export const createReviewFragranceLoader = (sources: ApiDataSources): DataLoader<ReviewFragranceKey, Fragrance> =>
  new DataLoader<ReviewFragranceKey, Fragrance>(async (keys) => {
    const { db } = sources

    const reviewIds = keys.map(key => key.reviewId)
    const { myUserId } = keys[0]
    const values = [reviewIds, myUserId]

    const { rows } = await db.query<Fragrance & { reviewId: number }>(BASE_QUERY, values)

    const fragrances = reviewIds.map(id => {
      const fragrance = rows.find(row => row.reviewId === id)
      if (fragrance == null) throw new Error(`Fragrance not found for reviewId ${id}`)

      return fragrance
    })

    return fragrances
  })
