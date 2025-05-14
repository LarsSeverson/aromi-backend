import { CollectionLoaderFactory } from './collectionLoaderFactory'
import { FragranceLoaderFactory } from './fragranceLoaderFactory'
import { type ApiServices } from '@src/services/services'

export interface ApiLoadersCache {
  fragrance: FragranceLoaderFactory
  collection: CollectionLoaderFactory
}

export class ApiLoaders implements ApiLoadersCache {
  fragrance: FragranceLoaderFactory
  collection: CollectionLoaderFactory

  constructor (services: ApiServices) {
    this.fragrance = new FragranceLoaderFactory(services.fragrance)
    this.collection = new CollectionLoaderFactory(services.collection)
  }
}
