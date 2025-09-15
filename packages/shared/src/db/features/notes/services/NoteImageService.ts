import type { NoteImageRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import type { DB } from '@src/db/db-schema.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import { BackendError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'

export class NoteImageService extends FeaturedTableService<NoteImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteImages')
  }

  findDistinct (
    where?: ExpressionOrFactory<DB, 'noteImages', SqlBool>
  ) {
    const query = this.Table
      .baseQuery
      .selectAll()
      .distinctOn('noteId')
      .orderBy('noteId')
      .where(this.Table.filterDeleted(where))

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }
}
