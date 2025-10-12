import { SearchService } from '@src/search/services/SearchService.js'
import type { FromUserRowParams, UserDoc } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class UserSearchService extends SearchService<UserDoc> {
  constructor (sources: DataSources) {
    super(sources, 'users')
  }

  fromRow (params: FromUserRowParams): UserDoc {
    const { user } = params
    const { email, cognitoSub, ...rest } = user
    return rest
  }
}