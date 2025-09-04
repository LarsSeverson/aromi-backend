import { ApiError } from '@src/common/error'
import { type DataSources } from '@src/datasources'
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
      )
    )
    .map(() => undefined)
}
