import type { DataSources } from '@src/datasources/DataSources.js'
import { FragranceService, UserService } from '@src/db/index.js'
import { ReviewSearchService } from '../services/ReviewSearchServices.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export const syncReviews = async (sources: DataSources) => {
  const userService = new UserService(sources)
  const fragranceService = new FragranceService(sources)
  const reviewSearch = new ReviewSearchService(sources)

  const reviews = await unwrapOrThrow(
    fragranceService.reviews.find()
  )

  const userIds = reviews.map((r) => r.userId)

  const users = userIds.length === 0
    ? []
    : await unwrapOrThrow(
      userService.find(
        where => where('id', 'in', reviews.map((r) => r.userId))
      )
    )

  const userMap = new Map(users.map(u => [u.id, u]))

  const reviewsWithRelations = reviews.map(review => ({
    review,
    user: userMap.get(review.userId)!
  }))

  const docs = reviewsWithRelations.map(row => reviewSearch.fromRow(row))

  console.log('\n--- Review Sync ---')
  console.log(`Fetched ${reviews.length} reviews from database`)
  console.log(`Indexing ${docs.length} review documents into search index\n`)

  return await unwrapOrThrow(reviewSearch.addDocuments(docs))
}