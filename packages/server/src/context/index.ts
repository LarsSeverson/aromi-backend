import { type ExpressContextFunctionArgument } from '@as-integrations/express5'
import { getMyContext } from './myContext'
import { ServerLoaders } from '@src/loaders/ServerLoaders'
import { type ServerQueues } from '../queues/ServerQueues'
import { type UserRow, type DataSources } from '@aromi/shared'
import { type ServerServices } from '@src/services/ServerServices'

export interface ServerContext extends ExpressContextFunctionArgument {
  me?: UserRow
  sources: DataSources
  services: ServerServices
  loaders: ServerLoaders
  queues: ServerQueues
}

export interface GetContextParams {
  serverArgs: ExpressContextFunctionArgument
  sources: DataSources
  services: ServerServices
  queues: ServerQueues
}

export const getContext = async (params: GetContextParams): Promise<ServerContext> => {
  const { serverArgs, sources, services, queues } = params
  const { req, res } = serverArgs

  const loaders = new ServerLoaders(services)

  const context: ServerContext = {
    req,
    res,
    sources,
    services,
    loaders,
    queues
  }

  const me = await getMyContext(context).unwrapOr(undefined)

  context.me = me

  return context
}
