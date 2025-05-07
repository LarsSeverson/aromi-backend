import { UserLoaders } from './userLoaders'
import { FragranceLoaders } from './fragranceLoaders'
import { type ApiServices } from '@src/services/services'

export interface ApiLoadersCache {
  user: UserLoaders
  fragrance: FragranceLoaders
}

export class ApiLoaders implements ApiLoadersCache {
  private readonly cache: Partial<ApiLoadersCache> = {}

  constructor (private readonly services: ApiServices) {}

  get user (): ApiLoadersCache['user'] {
    if (this.cache.user == null) {
      this.cache.user = new UserLoaders(this.services.user)
    }

    return this.cache.user
  }

  get fragrance (): ApiLoadersCache['fragrance'] {
    if (this.cache.fragrance == null) {
      this.cache.fragrance = new FragranceLoaders(this.services.fragrance)
    }

    return this.cache.fragrance
  }
}
