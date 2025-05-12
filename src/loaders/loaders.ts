import { FragranceLoaderFactory } from './fragranceLoaderFactory'
import { type ApiServices } from '@src/services/services'

export interface ApiLoadersCache {
  fragrance: FragranceLoaderFactory
}

export class ApiLoaders implements ApiLoadersCache {
  fragrance: FragranceLoaderFactory

  constructor (services: ApiServices) {
    this.fragrance = new FragranceLoaderFactory(services.fragrance)
  }
}
