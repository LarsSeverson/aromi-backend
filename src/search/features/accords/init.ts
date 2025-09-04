import { ApiError } from '@src/common/error'
import { type DataSources } from '@src/datasources'
import { INDEX_NAMES } from '@src/search/types'
import { ResultAsync } from 'neverthrow'
import { type AccordIndex } from './types'

export const initAccordsIndex = (
  meili: DataSources['meili']
): ResultAsync<undefined, ApiError> => {
  return ResultAsync
    .fromPromise(
      meili
        .client
        .createIndex(INDEX_NAMES.ACCORDS, { primaryKey: 'id' }),
      error => ApiError.fromMeili(error)
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
        error => ApiError.fromMeili(error)
      )
    )
    .map(() => undefined)
}
