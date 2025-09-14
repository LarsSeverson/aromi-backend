import type { ExistingNoteRow, FragranceNoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { BackendError } from '@src/utils/error.js'
import { ResultAsync } from 'neverthrow'
import type { NoteRow } from '../../notes/types.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class FragranceNoteService extends FeaturedTableService<FragranceNoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceNotes')
  }

  findNotes (
    where?: ExpressionOrFactory<DB, 'fragranceNotes' | 'notes', SqlBool>
  ): ResultAsync<NoteRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceNotes.noteId')
      .selectAll('notes')
      .where('fragranceNotes.deletedAt', 'is', null)
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

  findExisting (
    where?: ExpressionOrFactory<DB, 'fragranceNotes' | 'notes', SqlBool>
  ): ResultAsync<ExistingNoteRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceNotes.noteId')
      .selectAll('fragranceNotes')
      .select([
        'notes.name',
        'notes.description',
        'notes.s3Key',
        'notes.thumbnailImageId'
      ])
      .where('fragranceNotes.deletedAt', 'is', null)
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
