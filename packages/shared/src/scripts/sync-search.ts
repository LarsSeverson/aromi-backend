import { Result, ResultAsync } from 'neverthrow'
import { createDB, createMeiliSearchWrapper, DataSources } from '@src/datasources/index.js'
import { syncBrands } from '@src/search/features/brands/sync.js'
import { syncAccords } from '@src/search/features/accords/sync.js'
import { syncNotes } from '@src/search/features/notes/sync.js'
import { syncFragrances } from '@src/search/features/fragrances/sync.js'
import { syncUsers } from '@src/search/features/users/sync.js'

export const syncSearch = () => {
  return Result
    .combine([
      createMeiliSearchWrapper(),
      createDB()
    ])
    .asyncAndThen(([meili, db]) => ResultAsync
      .combine([
        syncBrands(meili, db),
        syncAccords(meili, db),
        syncNotes(meili, db),
        syncFragrances(meili, db),
        syncUsers(new DataSources())
      ]))
    .orTee(error => {
      console.error('Failed to sync search index:', error.details)
    })
    .andTee(() => {
      console.log('Search index synced successfully')
    })
}

void syncSearch()
