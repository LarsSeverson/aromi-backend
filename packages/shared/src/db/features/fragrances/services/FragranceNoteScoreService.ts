import type { DB } from '@src/db/db-schema.js'
import type { CombinedFragranceNoteScoreRow, FragranceNoteScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { TableService } from '@src/db/services/TableService.js'
import type { CursorPaginationInput } from '@src/db/types.js'
import type { SelectQueryBuilder, ReferenceExpression, ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'

export class FragranceNoteScoreService extends TableService<FragranceNoteScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceNoteScores')
  }

  findNotes <C>(
    where?: ExpressionOrFactory<DB, 'fragranceNoteScores', SqlBool>,
    pagination?: CursorPaginationInput<C>
  ): ResultAsync<CombinedFragranceNoteScoreRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceNoteScores.noteId')
      .selectAll('fragranceNoteScores')
      .select([
        'notes.id as id',
        'notes.id as noteId',
        'notes.name as noteName',
        'notes.s3Key as noteS3Key',
        'notes.description as noteDescription'
      ])
      .where('notes.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    if (pagination != null) {
      query = this.paginatedNotesQuery(pagination, query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  private paginatedNotesQuery<C, R>(
    input : CursorPaginationInput<C>,
    qb: SelectQueryBuilder<DB, 'fragranceNoteScores' | 'notes', R>
  ) {
    const { first, column, operator, direction, cursor } = input

    const parsedColumn = `fragranceNoteScores.${column}` as ReferenceExpression<DB, 'fragranceNoteScores'>
    const idColumn = 'fragranceNoteScores.noteId'

    return qb
      .$if(cursor.isValid, qb =>
        qb.where(w =>
          w.or([
            w.eb(parsedColumn, operator, cursor.value),
            w.and([
              w.eb(parsedColumn, '=', cursor.value),
              w.eb(idColumn, operator, cursor.lastId)
            ])
          ])
        )
      )
      .orderBy(parsedColumn, direction)
      .orderBy(idColumn, direction)
      .limit(first + 1)
  }
}