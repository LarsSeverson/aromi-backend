import { type ApiServices } from '@src/services/services'
import { UserLoaderFactory } from './UserLoaderFactory'
import { FragranceLoaderFactory } from './FragranceLoaderFactory'
import { CollectionLoaderFactory } from './CollectionLoaderFactory'

export interface ApiLoadersCache {
  user: UserLoaderFactory
  fragrance: FragranceLoaderFactory
  collection: CollectionLoaderFactory
  // review: ReviewLoaderFactory
}

export class ApiLoaders implements ApiLoadersCache {
  user: UserLoaderFactory
  fragrance: FragranceLoaderFactory
  collection: CollectionLoaderFactory
  // review: ReviewLoaderFactory

  constructor (services: ApiServices) {
    this.user = new UserLoaderFactory(services)
    this.fragrance = new FragranceLoaderFactory(services)
    this.collection = new CollectionLoaderFactory(services)

    // this.collection = new CollectionLoaderFactory(
    //   services.collection,
    //   services.user
    // )
    // this.review = new ReviewLoaderFactory(
    //   services.review,
    //   services.user,
    //   services.fragrance
    // )
  }
}
