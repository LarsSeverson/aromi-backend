import { type ApiDataSources } from '@src/datasources/datasources'
import { AuthService } from './authService'
import { UserService } from './userService'
import { type ApiServiceContext } from './apiService'

export abstract class ApiServices {
  auth: AuthService
  user: UserService

  constructor (sources: ApiDataSources) {
    this.auth = new AuthService(sources)
    this.user = new UserService(sources)
  }

  setContext (context: ApiServiceContext): this {
    this.user.setContext(context)
    return this
  }
}
