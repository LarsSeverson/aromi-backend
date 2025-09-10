import type { FragranceRequestNoteRow, DB, NoteRow } from '@src/db/index.js'
import type { DataSources } from '@src/datasources/index.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import { TableService } from '@src/db/services/TableService.js'

export class FragranceRequestNoteService extends TableService<'fragranceRequestNotes', FragranceRequestNoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestNotes')
  }

  findNotes (
    where?: ExpressionOrFactory<DB, 'fragranceRequestNotes' | 'notes', SqlBool>
  ): ResultAsync<NoteRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceRequestNotes.noteId')
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
