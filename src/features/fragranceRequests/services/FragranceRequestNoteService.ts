import { TableService } from '@src/services/TableService'
import { type FragranceRequestNoteRow } from '../types'
import { type DataSources } from '@src/datasources'
import { type ExpressionOrFactory, type SqlBool } from 'kysely'
import { type DB } from '@src/db/schema'
import { ResultAsync } from 'neverthrow'
import { type NoteRow } from '@src/features/notes/types'
import { ApiError } from '@src/common/error'

export class FragranceRequestNoteService extends TableService<'fragranceRequestNotes', FragranceRequestNoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestNotes')
  }

  findNotes (
    where?: ExpressionOrFactory<DB, 'fragranceRequestNotes' | 'notes', SqlBool>
  ): ResultAsync<NoteRow[], ApiError> {
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
        error => ApiError.fromDatabase(error)
      )
  }
}
