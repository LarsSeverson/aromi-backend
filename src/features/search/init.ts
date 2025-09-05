import { createMeiliSearchWrapper } from '@src/datasources/meilisearch'
import { ResultAsync } from 'neverthrow'
import { initAccordsIndex } from './features/accords/init'
import { type ApiError } from '@src/utils/error'
import { initBrandsIndex } from './features/brands/init'
import { initNotesIndex } from './features/notes/init'

export const initSearch = (): ResultAsync<undefined, ApiError> => {
  return createMeiliSearchWrapper()
    .asyncAndThen(meili => ResultAsync
      .combine([
        initBrandsIndex(meili),
        initAccordsIndex(meili),
        initNotesIndex(meili)
      ])
    )
    .map(() => undefined)
}

void initSearch()
