import { BackendError } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'
import type { FragranceIndex } from './types.js'
import { INDEX_NAMES } from '../../types.js'

export const initFragrancesIndex = (
  meili: DataSources['meili']
) => {
  return ResultAsync
    .fromPromise(
      meili
        .client
        .updateIndex(INDEX_NAMES.FRAGRANCES, { primaryKey: 'id' }),
      error => BackendError.fromMeili(error)
    )
    .orElse(() =>
      ResultAsync
        .fromPromise(
          meili
            .client
            .createIndex(INDEX_NAMES.FRAGRANCES, { primaryKey: 'id' }),
          error => BackendError.fromMeili(error)
        )
    )
    .andThen(() => ResultAsync
      .fromPromise(
        meili
          .client
          .index<FragranceIndex>(INDEX_NAMES.FRAGRANCES)
          .updateSettings({
            searchableAttributes: [
              'name',
              'brand.name',
              'accords.name',
              'notes.name'
            ],
            sortableAttributes: ['createdAt', 'updatedAt']
          }),
        error => BackendError.fromMeili(error)
      )
    )
}
