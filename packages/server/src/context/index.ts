import type { ExpressContextFunctionArgument } from '@as-integrations/express5'
import { getMyContext } from './myContext.js'
import { ServerLoaders } from '@src/loaders/ServerLoaders.js'
import type { ServerQueues } from '../queues/ServerQueues.js'
import type { UserRow, DataSources } from '@aromi/shared'
import type { ServerServices } from '@src/services/ServerServices.js'

export interface ServerContext extends ExpressContextFunctionArgument {
  me?: UserRow
  sources: DataSources
  services: ServerServices
  loaders: ServerLoaders
  queues: ServerQueues

  accessToken?: string
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

  const { user: me, accessToken } = await getMyContext(context).unwrapOr(undefined) ?? {}

  context.me = me
  context.accessToken = accessToken

  return context
}
