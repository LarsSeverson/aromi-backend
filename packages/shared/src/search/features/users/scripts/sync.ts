import type { DataSources } from '@src/datasources/DataSources.js'
import { UserSearchService } from '../services/UserSearchService.js'
import { UserService } from '@src/db/index.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export const syncUsers = async (sources: DataSources) => {
  const userService = new UserService(sources)
  const userSearch = new UserSearchService(sources)

  const users = await unwrapOrThrow(userService.find())
  const docs = users.map(user => userSearch.fromRow(user))

  console.log('\n--- User Sync ---')
  console.log(`Fetched ${users.length} users from database`)
  console.log(`Indexing ${docs.length} user documents into search index\n`)

  return await unwrapOrThrow(userSearch.addDocuments(docs))
}