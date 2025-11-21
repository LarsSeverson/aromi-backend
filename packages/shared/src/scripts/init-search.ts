import { ResultAsync } from 'neverthrow'
import type { BackendError } from '@src/utils/error.js'
import { createMeiliSearchWrapper } from '@src/datasources/index.js'
import { initBrandsIndex } from '../search/features/brands/init.js'
import { initAccordsIndex } from '../search/features/accords/init.js'
import { initNotesIndex } from '../search/features/notes/init.js'
import { initFragrancesIndex } from '@src/search/features/fragrances/init.js'
import { initUsersIndex } from '@src/search/features/users/init.js'

export const initSearch = (): ResultAsync<undefined, BackendError> => {
  return createMeiliSearchWrapper()
    .asyncAndThen(meili => ResultAsync
      .combine([
        initBrandsIndex(meili),
        initAccordsIndex(meili),
        initNotesIndex(meili),
        initFragrancesIndex(meili),
        initUsersIndex(meili)
      ]))
    .map(() => undefined)
}

void initSearch()
