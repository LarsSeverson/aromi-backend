import { type ApiContext } from '@src/context'

export interface ApiServiceContext {
  me?: ApiContext['me']
}

export abstract class ApiService {
  context: ApiServiceContext = {}

  // Utils
  setContext (context: ApiServiceContext): this {
    this.context = context
    return this
  }
}
