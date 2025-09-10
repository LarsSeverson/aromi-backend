import { BackendError } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'

export const syncNotes = (
  meili: DataSources['meili'],
  db: DataSources['db']
): ResultAsync<undefined, BackendError> => {
  return ResultAsync
    .fromPromise(
      db
        .selectFrom('notes')
        .selectAll()
        .where('deletedAt', 'is', null)
        .execute(),
      error => BackendError.fromDatabase(error)
    )
    .andThen(notes => ResultAsync
      .fromPromise(
        meili
          .client
          .index('notes')
          .addDocuments(notes),
        error => BackendError.fromMeili(error)
      ))
    .map(() => undefined)
}
