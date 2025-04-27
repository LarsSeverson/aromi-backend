import { type ApiDataSources } from '@src/datasources'
import { AuthService } from './authService'

export interface ApiServices {
  auth: AuthService
}

export const createServices = (sources: ApiDataSources): ApiServices => {
  const { cog } = sources

  const auth = new AuthService(cog)

  return {
    auth
  }
}
