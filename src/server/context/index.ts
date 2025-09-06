import { type ExpressContextFunctionArgument } from '@as-integrations/express5'
import { type DataSources } from '@src/datasources'
import { type ServerServices } from '@src/server/services/ServerServices'
import { getMyContext } from './myContext'
import { type UserRow } from '@src/db/features/users/types'
import { ServerLoaders } from '@src/server/loaders/ServerLoaders'
import { type ServerQueues } from '../queues/ServerQueues'

export interface ServerContext extends ExpressContextFunctionArgument {
  sources: DataSources
  services: ServerServices
  loaders: ServerLoaders
  queues: ServerQueues
  me?: UserRow
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
