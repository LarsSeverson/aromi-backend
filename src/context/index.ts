import { type ExpressContextFunctionArgument } from '@as-integrations/express5'
import { type DataSources } from '@src/datasources'
import { type ApiServices } from '@src/services/ApiServices'
import { getMyContext } from './myContext'
import { type UserRow } from '@src/features/users/types'

export interface ApiContext extends ExpressContextFunctionArgument {
  sources: DataSources
  services: ApiServices
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

  const context: ApiContext = {
    req,
    res,
    sources,
    services
  }

  const me = await getMyContext(context).unwrapOr(undefined)

  context.me = me

  return context
}
