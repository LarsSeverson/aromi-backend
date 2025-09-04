import { ApiError } from '@src/common/error'
import { type DataSources } from '@src/datasources'
import { INDEX_NAMES } from '@src/search/types'
import { ResultAsync } from 'neverthrow'

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
