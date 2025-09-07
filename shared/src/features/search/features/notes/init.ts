import { ApiError } from '@src/utils/error'
import { type DataSources } from '@src/datasources'
import { ResultAsync } from 'neverthrow'
import { INDEX_NAMES } from '../../types'

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
      )
    )
    .map(() => undefined)
}
