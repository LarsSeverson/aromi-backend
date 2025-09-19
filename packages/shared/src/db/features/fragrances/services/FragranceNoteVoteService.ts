import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceNoteVoteRow, LayerNoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { BackendError } from '@src/utils/error.js'
import { ResultAsync } from 'neverthrow'

export class FragranceNoteVoteService extends FeaturedTableService<FragranceNoteVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceNoteVotes')
  }

  findNotes (
    where?: ExpressionOrFactory<DB, 'fragranceNoteVotes' | 'notes', SqlBool>
  ): ResultAsync<LayerNoteRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceNoteVotes.noteId')
      .selectAll('notes')
      .select('fragranceNoteVotes.layer as layer')
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