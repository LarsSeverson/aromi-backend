import { ApiError } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'

export const syncAccords = (
  meili: DataSources['meili'],
  db: DataSources['db']
): ResultAsync<undefined, ApiError> => {
  return ResultAsync
    .fromPromise(
      db
        .selectFrom('accords')
        .selectAll()
        .where('deletedAt', 'is', null)
        .execute(),
      error => ApiError.fromDatabase(error)
    )
    .andThen(accords => ResultAsync
      .fromPromise(
        meili
          .client
          .index('accords')
          .addDocuments(accords),
        error => ApiError.fromMeili(error)
      ))
    .map(() => undefined)
}
