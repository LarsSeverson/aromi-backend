import { ApiError } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'
import { INDEX_NAMES } from '../../types.js'

export const initNotesIndex = (
  meili: DataSources['meili']
): ResultAsync<undefined, ApiError> => {
  return ResultAsync
    .fromPromise(
      meili
        .client
        .createIndex(INDEX_NAMES.NOTES, { primaryKey: 'id' }),
      error => ApiError.fromMeili(error)
    )
    .andThen(() => ResultAsync
      .fromPromise(
        meili
          .client
          .index(INDEX_NAMES.NOTES)
          .updateSettings({
            searchableAttributes: ['name', 'description'],
            sortableAttributes: ['createdAt', 'updatedAt']
          }),
        error => ApiError.fromMeili(error)
      ))
    .map(() => undefined)
}
