import { ApiLoaders } from './loaders/loaders'
import { authenticateMe } from './middleware/auth.middleware'
import { type ApiDataSources } from './datasources/datasources'
import { type ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4'
import { type ApiServices } from './services/services'
import { type UserSummary } from './schemas/user/mappers'

export interface ApiContext extends ExpressContextFunctionArgument {
  sources: ApiDataSources
  loaders: ApiLoaders
  services: ApiServices
  me?: UserSummary
}

export interface GetContextParams {
  serverArgs: ExpressContextFunctionArgument
  sources: ApiDataSources
  services: ApiServices
}

export const getContext = async (params: GetContextParams): Promise<ApiContext> => {
  const { serverArgs, sources, services } = params
  const { req, res } = serverArgs

  const loaders = new ApiLoaders(services)
  const context: ApiContext = {
    req,
    res,
    sources,
    services,
    loaders,
    me: undefined
  }

  const me = await authenticateMe(context)

  context.me = me
  services.setContext({ me })

  return {
    req,
    res,
    sources,
    services,
    loaders,
    me
  }
}
