import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceReview, FragranceReviewDistribution } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'

export const reviewDistribution = async (parent: Fragrance, args: undefined, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceReviewDistribution | null> => {
  const fragranceId = parent.id

  if (!fragranceId) return null

  const query = `--sql
    SELECT rating, COUNT(*) AS count 
    FROM fragrance_reviews
    WHERE fragrance_id = $1
    GROUP BY rating
  `
  const values = [fragranceId]
  const { rows } = await ctx.pool.query<FragranceReview & { count: number }>(query, values)
  const distribution = { one: 0, two: 0, three: 0, four: 0, five: 0 } as FragranceReviewDistribution
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
