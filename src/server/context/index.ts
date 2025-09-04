import { type ExpressContextFunctionArgument } from '@as-integrations/express5'
import { type DataSources } from '@src/datasources'
import { type ApiServices } from '@src/server/services/ApiServices'
import { getMyContext } from './myContext'
import { type UserRow } from '@src/server/features/users/types'
import { ApiLoaders } from '@src/server/loaders/ApiLoaders'

export interface ApiContext extends ExpressContextFunctionArgument {
  sources: DataSources
  services: ApiServices
  loaders: ApiLoaders
  me?: UserRow
}

export interface GetContextParams {
  serverArgs: ExpressContextFunctionArgument
  sources: DataSources
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
    loaders
  }

  const me = await getMyContext(context).unwrapOr(undefined)

  context.me = me

  return context
}
