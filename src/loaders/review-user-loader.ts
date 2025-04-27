import { type ApiDataSources } from '@src/datasources'
import { type User } from '@src/generated/gql-types'
import DataLoader from 'dataloader'

const BASE_QUERY = /* sql */`
  SELECT
    fr.id AS "reviewId",
    u.id,
    u.username,
    u.email,
    u.cognito_id AS "cognitoId",
    0 AS followers,
    0 AS following
  FROM fragrance_reviews fr
  JOIN users u ON u.id = fr.user_id
  WHERE fr.id = ANY($1)
`

export interface ReviewUserKey {
  reviewId: number
}

export const createReviewUserLoader = (sources: ApiDataSources): DataLoader<ReviewUserKey, User> =>
  new DataLoader<ReviewUserKey, User>(async (keys) => {
    const { db } = sources

    const reviewIds = keys.map(key => key.reviewId)
    const values = [reviewIds]

    const { rows } = await db.query<User & { reviewId: number }>(BASE_QUERY, values)

    const users = reviewIds.map(id => {
      const user = rows.find(row => row.reviewId === id)
      if (user == null) throw new Error(`User not found for reviewId ${id}`)

      return user
    })

    return users
  })
