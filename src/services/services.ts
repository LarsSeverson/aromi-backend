import { type ApiDataSources } from '@src/datasources/datasources'
import { AuthService } from './authService'
import { UserService } from './userService'
import { FragranceService } from './fragranceService'

export class ApiServices {
  auth: AuthService
  user: UserService
  fragrance: FragranceService

  constructor (sources: ApiDataSources) {
    this.auth = new AuthService(sources)
    this.user = new UserService(sources)
    this.fragrance = new FragranceService(sources)
  }
}
