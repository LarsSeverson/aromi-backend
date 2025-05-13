import { type ApiDataSources } from '@src/datasources/datasources'
import { AuthService } from './authService'
import { UserService } from './userService'
import { type ApiServiceContext } from './apiService'
import { FragranceService } from './fragranceService'
import { CollectionService } from './collectionService'

export class ApiServices {
  auth: AuthService
  user: UserService
  fragrance: FragranceService
  collection: CollectionService

  constructor (sources: ApiDataSources) {
    this.auth = new AuthService(sources)
    this.user = new UserService(sources)
    this.fragrance = new FragranceService(sources)
    this.collection = new CollectionService(sources)
  }

  setContext (context: ApiServiceContext): this {
    this.user.setContext(context)
    this.fragrance.setContext(context)
    this.collection.setContext(context)

    return this
  }
}
