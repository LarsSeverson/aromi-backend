import { BackendError } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'
import { INDEX_NAMES } from '../../types.js'

export const initNotesIndex = (
  meili: DataSources['meili']
) => {
  return ResultAsync
    .fromPromise(
      meili
        .client
        .updateIndex(INDEX_NAMES.NOTES, { primaryKey: 'id' }),
      error => BackendError.fromMeili(error)
    )
    .orElse(() =>
      ResultAsync
        .fromPromise(
          meili
            .client
            .createIndex(INDEX_NAMES.NOTES, { primaryKey: 'id' }),
          error => BackendError.fromMeili(error)
        )
    )
    .andThen(() =>
      ResultAsync.fromPromise(
        meili
          .client
          .index(INDEX_NAMES.NOTES).updateSettings({
            searchableAttributes: ['name', 'description'],
            sortableAttributes: ['createdAt', 'updatedAt']
          }),
        error => BackendError.fromMeili(error)
      )
    )
}
