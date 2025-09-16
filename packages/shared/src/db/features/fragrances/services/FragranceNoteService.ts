import type { CombinedFragranceNoteRow, FragranceNoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { BackendError } from '@src/utils/error.js'
import { ResultAsync } from 'neverthrow'
import type { ExpressionOrFactory, SelectQueryBuilder, SqlBool, ReferenceExpression } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { CursorPaginationInput } from '@src/db/types.js'

export class FragranceNoteService extends FeaturedTableService<FragranceNoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceNotes')
  }

  findNotes <C>(
    where?: ExpressionOrFactory<DB, 'fragranceNotes' | 'notes', SqlBool>,
    pagination?: CursorPaginationInput<C>
  ): ResultAsync<CombinedFragranceNoteRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceNotes.noteId')
      .selectAll('fragranceNotes')
      .select([
        'notes.id as noteId',
        'notes.name as noteName',
        'notes.s3Key as noteS3Key',
        'notes.description as noteDescription'
      ])
      .where('fragranceNotes.deletedAt', 'is', null)
      .where('notes.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    if (pagination != null) {
      query = this.paginationNotesQuery(pagination, query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  private paginationNotesQuery<C, R>(
    input: CursorPaginationInput<C>,
    qb: SelectQueryBuilder<DB, 'fragranceNotes' | 'notes', R>
  ) {
    const { first, column, operator, direction, cursor } = input

    const parsedColumn = `fragranceNotes.${column}` as ReferenceExpression<DB, 'fragranceNotes'>
    const idColumn = 'fragranceNotes.id'

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
