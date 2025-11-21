import type { DataSources } from '@src/datasources/DataSources.js'
import { INDEX_NAMES } from '@src/search/types.js'
import { BackendError } from '@src/utils/error.js'
import { ResultAsync } from 'neverthrow'

export const initUsersIndex = (
  meili: DataSources['meili']
) => {
  return ResultAsync
    .fromPromise(
      meili
        .client
        .createIndex(INDEX_NAMES.USERS, { primaryKey: 'id' }),
      error => BackendError.fromMeili(error)
    )
    .andThen(() => ResultAsync
      .fromPromise(
        meili
          .client
          .index(INDEX_NAMES.USERS)
          .updateSettings({
            searchableAttributes: [
              'username'
            ],
            sortableAttributes: ['createdAt', 'updatedAt']
          }),
        error => BackendError.fromMeili(error)
      )
    )
}