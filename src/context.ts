import { type User } from './generated/gql-types'
import { createLoaders, type ApiLoaders } from './loaders/loaders'
import { authenticateMe } from './middleware/auth.middleware'
import { type ApiDataSources } from './datasources'
import { type ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4'

export interface Context extends ExpressContextFunctionArgument {
  sources: ApiDataSources
  loaders: ApiLoaders
  me?: User
}

export interface GetContextParams {
  serverArgs: ExpressContextFunctionArgument
  sources: ApiDataSources
}

export const getContext = async (params: GetContextParams): Promise<Context> => {
  const { serverArgs, sources } = params
  const { req, res } = serverArgs

  const cache: Partial<ApiLoaders> = {}
  const loaders = createLoaders(cache, sources)
  const me = await authenticateMe(req, sources)

  return {
    req,
    res,
    sources,
    loaders,
    me
  }
}
