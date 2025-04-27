import { type ApiDataSources } from '@src/datasources'
import { createCollectionUserLoader } from './collection-user-loader'
import { createFragranceImagesLoader } from './fragrance-images-loader'
import { createFragranceReviewsLoader } from './fragrance-review-loader'
import { createReviewFragranceLoader } from './review-fragrance-loader'
import { createReviewUserLoader } from './review-user-loader'
import { createUserReviewsLoader } from './user-reviews-loader'

export interface ApiLoaders {
  fragranceImages: ReturnType<typeof createFragranceImagesLoader>
  fragranceReviews: ReturnType<typeof createFragranceReviewsLoader>
  userReviews: ReturnType<typeof createUserReviewsLoader>
  reviewFragrance: ReturnType<typeof createReviewFragranceLoader>
  reviewUser: ReturnType<typeof createReviewUserLoader>
  collectionUser: ReturnType<typeof createCollectionUserLoader>
}
export const createLoaders = (cache: Partial<ApiLoaders>, sources: ApiDataSources): ApiLoaders => {
  const loaders: ApiLoaders = {
    get fragranceImages () {
      if (cache.fragranceImages == null) {
        cache.fragranceImages = createFragranceImagesLoader(sources)
      }

      return cache.fragranceImages
    },
    get fragranceReviews () {
      if (cache.fragranceReviews == null) {
        cache.fragranceReviews = createFragranceReviewsLoader(sources)
      }

      return cache.fragranceReviews
    },
    get userReviews () {
      if (cache.userReviews == null) {
        cache.userReviews = createUserReviewsLoader(sources)
      }

      return cache.userReviews
    },
    get reviewFragrance () {
      if (cache.reviewFragrance == null) {
        cache.reviewFragrance = createReviewFragranceLoader(sources)
      }

      return cache.reviewFragrance
    },
    get reviewUser () {
      if (cache.reviewUser == null) {
        cache.reviewUser = createReviewUserLoader(sources)
      }

      return cache.reviewUser
    },
    get collectionUser () {
      if (cache.collectionUser == null) {
        cache.collectionUser = createCollectionUserLoader(sources)
      }

      return cache.collectionUser
    }
  }

  return loaders
}
