import type { ApiError } from '@src/utils/error.js'
import { Result, ResultAsync } from 'neverthrow'
import { syncAccords } from './features/accords/sync.js'
import { syncBrands } from './features/brands/sync.js'
import { syncNotes } from './features/notes/sync.js'
import { createDB, createMeiliSearchWrapper } from '@src/datasources/index.js'

export const syncSearch = (): ResultAsync<undefined, ApiError> => {
  return Result
    .combine([
      createMeiliSearchWrapper(),
      createDB()
    ])
    .asyncAndThen(([meili, db]) => ResultAsync
      .combine([
        syncBrands(meili, db),
        syncAccords(meili, db),
        syncNotes(meili, db)
      ]))
    .map(() => undefined)
}

void syncSearch()
