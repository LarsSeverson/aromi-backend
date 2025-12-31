import { SearchService } from '@src/search/services/SearchService.js'
import type { ReviewDoc, ReviewFromRowParams } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { INDEX_NAMES } from '@src/search/types.js'

export class ReviewSearchService extends SearchService<ReviewDoc> {
  constructor (sources: DataSources) {
    super(sources, INDEX_NAMES.REVIEWS)
  }

  fromRow (params: ReviewFromRowParams): ReviewDoc {
    const { review, user } = params

    const reviewUser = {
      id: user.id,
      username: user.username
    }

    return {
      ...review,
      user: reviewUser
    }
  }

  override createIndex () {
    return super.createIndex({ primaryKey: 'id' })
  }

  override configureIndex () {
    return super.configureIndex({
      searchableAttributes: [
        'body',
        'user.username'
      ],
      filterableAttributes: [
        'fragranceId',
        'rating'
      ],
      sortableAttributes: [
        'rating',
        'createdAt',
        'updatedAt'
      ]
    })
  }
}