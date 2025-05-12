import { FragranceLoaders } from './fragranceLoaders'
import { type ApiServices } from '@src/services/services'

export interface ApiLoadersCache {
  fragrance: FragranceLoaders
}

export class ApiLoaders implements ApiLoadersCache {
  fragrance: FragranceLoaders

  constructor (services: ApiServices) {
    this.fragrance = new FragranceLoaders(services.fragrance)
  }
}

export class ApiLoader {
  generateKey (...params: unknown[]): string {
    return params.map(p => JSON.stringify(p)).sort().join(':')
  }
}
