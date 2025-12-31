import { SearchService } from '@src/search/services/SearchService.js'
import type { UserDoc } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import type { UserRow } from '@src/db/index.js'

export class UserSearchService extends SearchService<UserDoc> {
  constructor (sources: DataSources) {
    super(sources, 'users')
  }

  fromRow (user: UserRow): UserDoc {
    const { email, cognitoSub, ...rest } = user
    return rest
  }

  override createIndex () {
    return super.createIndex({ primaryKey: 'id' })
  }

  override configureIndex () {
    return super.configureIndex({
      searchableAttributes: [
        'username'
      ],
      sortableAttributes: [
        'createdAt',
        'updatedAt'
      ]
    })
  }
}