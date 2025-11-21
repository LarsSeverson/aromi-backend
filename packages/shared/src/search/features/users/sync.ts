import type { DataSources } from '@src/datasources/DataSources.js'
import { UserSearchService } from './services/UserSearchService.js'
import { UserService } from '@src/db/index.js'

export const syncUsers = (
  sources: DataSources
) => {
  const userService = new UserService(sources)
  const userSearch = new UserSearchService(sources)

  return userService
    .find()
    .map(users => users.map(user => userSearch.fromRow({ user })))
    .andThen(docs => userSearch.addDocuments(docs))
}