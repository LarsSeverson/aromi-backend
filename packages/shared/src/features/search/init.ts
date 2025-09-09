import { ResultAsync } from 'neverthrow'
import type { ApiError } from '@src/utils/error.js'
import { createMeiliSearchWrapper } from '@src/datasources/index.js'
import { initBrandsIndex } from './features/brands/init.js'
import { initAccordsIndex } from './features/accords/init.js'
import { initNotesIndex } from './features/notes/init.js'

export const initSearch = (): ResultAsync<undefined, ApiError> => {
  return createMeiliSearchWrapper()
    .asyncAndThen(meili => ResultAsync
      .combine([
        initBrandsIndex(meili),
        initAccordsIndex(meili),
        initNotesIndex(meili)
      ]))
    .map(() => undefined)
}

void initSearch()
