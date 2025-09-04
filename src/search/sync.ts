import { type ApiError } from '@src/common/error'
import { createMeiliSearchWrapper } from '@src/datasources/meilisearch'
import { createDB } from '@src/db'
import { Result, ResultAsync } from 'neverthrow'
import { syncAccords } from './features/accords/sync'
import { syncBrands } from './features/brands/sync'
import { syncNotes } from './features/notes/sync'

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
      ])
    )
    .map(() => undefined)
}

void syncSearch()
