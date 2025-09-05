import { type ExpressContextFunctionArgument } from '@as-integrations/express5'
import { type DataSources } from '@src/datasources'
import { type ServerServices } from '@src/server/services/ServerServices'
import { getMyContext } from './myContext'
import { type UserRow } from '@src/db/features/users/types'
import { ApiLoaders } from '@src/server/loaders/ApiLoaders'

export interface ServerContext extends ExpressContextFunctionArgument {
  sources: DataSources
  services: ServerServices
  loaders: ApiLoaders
  me?: UserRow
}

export interface GetContextParams {
  serverArgs: ExpressContextFunctionArgument
  sources: DataSources
  services: ServerServices
}

export const getContext = async (params: GetContextParams): Promise<ServerContext> => {
  const { serverArgs, sources, services } = params
  const { req, res } = serverArgs

  const loaders = new ApiLoaders(services)

  const context: ServerContext = {
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
