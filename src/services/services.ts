import { type ApiDataSources } from '@src/datasources/datasources'
import { AuthService } from './authService'
import { UserService } from './userService'
import { FragranceService } from './fragranceService'
import { CollectionService } from './collectionService'
import { ReviewService } from './reviewService'
import { type ApiServiceContext } from './apiService'
import { AssetService } from './assetService'

export class ApiServices {
  auth: AuthService
  asset: AssetService
  user: UserService
  fragrance: FragranceService
  collection: CollectionService
  review: ReviewService

  constructor (sources: ApiDataSources) {
    this.auth = new AuthService(sources)
    this.asset = new AssetService(sources)
    this.user = new UserService(sources)
    this.fragrance = new FragranceService(sources)
    this.collection = new CollectionService(sources)
    this.review = new ReviewService(sources)
  }

  setContext (context: ApiServiceContext): this {
    this
      .user
      .setContext(context)
    this
      .fragrance
      .setContext(context)
    this
      .collection
      .setContext(context)

    return this
  }
}
