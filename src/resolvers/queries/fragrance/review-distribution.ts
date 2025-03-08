import { type FragranceResolvers, type FragranceReview, type FragranceReviewDistribution } from '@src/generated/gql-types'

const REVIEW_DIST_QUERY = /* sql */`
  SELECT rating, COUNT(*) AS count 
  FROM fragrance_reviews
  WHERE fragrance_id = $1
  GROUP BY rating
`

export const reviewDistribution: FragranceResolvers['reviewDistribution'] = async (parent, args, context, info) => {
  const { id } = parent
  const { pool } = context

  const distribution: FragranceReviewDistribution = { one: 0, two: 0, three: 0, four: 0, five: 0 }

  const values = [id]
  const { rows } = await pool.query<FragranceReview & { count: number }>(REVIEW_DIST_QUERY, values)

  rows.forEach(row => {
    const { rating, count } = row
    if (rating === 1) distribution.one = count
    if (rating === 2) distribution.two = count
    if (rating === 3) distribution.three = count
    if (rating === 4) distribution.four = count
    if (rating === 5) distribution.five = count
  })

  return distribution
}
