import { ApiError } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'

export const syncBrands = (
  meili: DataSources['meili'],
  db: DataSources['db']
): ResultAsync<undefined, ApiError> => {
  return ResultAsync
    .fromPromise(
      db
        .selectFrom('brands')
        .selectAll()
        .where('deletedAt', 'is', null)
        .execute(),
      error => ApiError.fromDatabase(error)
    )
    .andThen(brands => ResultAsync
      .fromPromise(
        meili
          .client
          .index('brands')
          .addDocuments(brands),
        error => ApiError.fromMeili(error)
      ))
    .map(() => undefined)
}
