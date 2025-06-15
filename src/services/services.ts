import { type ApiDataSources } from '@src/datasources/datasources'
import { type ApiServiceContext } from './ApiService'
import { FragranceService } from './FragranceService'
import { AuthService } from './AuthService'
import { UserService } from './UserService'
import { AssetService } from './AssetService'

export class ApiServices {
  auth: AuthService
  asset: AssetService
  user: UserService
  fragrance: FragranceService

  constructor (sources: ApiDataSources) {
    this.auth = new AuthService(sources)
    this.asset = new AssetService(sources)
    this.user = new UserService(sources)
    this.fragrance = new FragranceService(sources)
  }

  setContext (context: ApiServiceContext): this {
    this
      .user
      .setContext(context)

    this
      .fragrance
      .setContext(context)

    return this
  }
}
