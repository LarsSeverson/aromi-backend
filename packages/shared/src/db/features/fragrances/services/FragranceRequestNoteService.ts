import { type FragranceRequestNoteRow, type DB, FeaturedTableService, type LayerNoteRow } from '@src/db/index.js'
import type { DataSources } from '@src/datasources/index.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'

export class FragranceRequestNoteService extends FeaturedTableService<FragranceRequestNoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestNotes')
  }

  findNotes (
    where?: ExpressionOrFactory<DB, 'fragranceRequestNotes' | 'notes', SqlBool>
  ): ResultAsync<LayerNoteRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceRequestNotes.noteId')
      .select('fragranceRequestNotes.layer')
      .selectAll('notes')
      .where('fragranceRequestNotes.deletedAt', 'is', null)
      .where('notes.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }
}
