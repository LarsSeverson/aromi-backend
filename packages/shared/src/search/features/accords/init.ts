import { BackendError } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'
import type { AccordIndex } from './types.js'
import { INDEX_NAMES } from '../../types.js'

export const initAccordsIndex = (
  meili: DataSources['meili']
) => {
  return ResultAsync
    .fromPromise(
      meili
        .client
        .createIndex(INDEX_NAMES.ACCORDS, { primaryKey: 'id' }),
      error => BackendError.fromMeili(error)
    )
    .andThen(() => ResultAsync
      .fromPromise(
        meili
          .client
          .index<AccordIndex>(INDEX_NAMES.ACCORDS)
          .updateSettings({
            searchableAttributes: ['name'],
            sortableAttributes: ['createdAt', 'updatedAt']
          }),
        error => BackendError.fromMeili(error)
      )
    )
}
