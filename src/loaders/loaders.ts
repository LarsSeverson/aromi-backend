import { CollectionLoaderFactory } from './collectionLoaderFactory'
import { FragranceLoaderFactory } from './fragranceLoaderFactory'
import { type ApiServices } from '@src/services/services'
import { ReviewLoaderFactory } from './reviewLoaderFactory'

export interface ApiLoadersCache {
  fragrance: FragranceLoaderFactory
  collection: CollectionLoaderFactory
  review: ReviewLoaderFactory
}

export class ApiLoaders implements ApiLoadersCache {
  fragrance: FragranceLoaderFactory
  collection: CollectionLoaderFactory
  review: ReviewLoaderFactory

  constructor (services: ApiServices) {
    this.fragrance = new FragranceLoaderFactory(
      services.fragrance,
      services.review
    )
    this.collection = new CollectionLoaderFactory(
      services.collection,
      services.user
    )
    this.review = new ReviewLoaderFactory(
      services.review,
      services.user,
      services.fragrance
    )
  }
}
