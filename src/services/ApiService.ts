import { type ApiContext } from '@src/context'
import { type ApiDataSources } from '@src/datasources/datasources'

export interface ApiServiceContext {
  me?: ApiContext['me']
}

export abstract class ApiService {
  sources: ApiDataSources
  context: ApiServiceContext = {}

  constructor (sources: ApiDataSources) {
    this.sources = sources
  }

  setContext (context: ApiServiceContext): this {
    this.context = context
    return this
  }
}
