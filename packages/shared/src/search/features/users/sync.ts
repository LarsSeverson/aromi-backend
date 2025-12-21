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
    .andTee(users => {
      console.log(`Fetched ${users.length} users from database`)
    })
    .map(users => users.map(user => userSearch.fromRow({ user })))
    .andThen(docs => userSearch.addDocuments(docs))
}