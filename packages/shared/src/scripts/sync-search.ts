import { DataSources } from '@src/datasources/index.js'
import { syncBrands } from '@src/search/features/brands/scripts/sync.js'
import { syncAccords } from '@src/search/features/accords/scripts/sync.js'
import { syncNotes } from '@src/search/features/notes/scripts/sync.js'
import { syncFragrances } from '@src/search/features/fragrances/scripts/sync.js'
import { syncUsers } from '@src/search/features/users/scripts/sync.js'
import { syncPosts } from '@src/search/features/posts/scripts/sync.js'
import { syncComments } from '@src/search/features/posts/scripts/sync-comments.js'

export const syncSearch = async () => {
  const sources = new DataSources()

  await syncAccords(sources)
  await syncBrands(sources)
  await syncNotes(sources)
  await syncFragrances(sources)
  await syncUsers(sources)
  await syncPosts(sources)
  await syncComments(sources)
}

syncSearch()
  .then(() => {
    console.log('Process complete.')
    process.exit(0)
  })
  .catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
