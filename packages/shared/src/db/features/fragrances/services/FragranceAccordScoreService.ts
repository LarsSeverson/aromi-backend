import { TableService } from '@src/db/services/TableService.js'
import type { CombinedFragranceAccordScoreRow, FragranceAccordScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import type { ExpressionOrFactory, SelectQueryBuilder, SqlBool, ReferenceExpression } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import type { CursorPaginationInput } from '@src/db/types.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'

export class FragranceAccordScoreService extends TableService<FragranceAccordScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceAccordScores')
  }

  findAccords <C>(
    where?: ExpressionOrFactory<DB, 'fragranceAccordScores', SqlBool>,
    pagination?: CursorPaginationInput<C>
  ): ResultAsync<CombinedFragranceAccordScoreRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('accords', 'accords.id', 'fragranceAccordScores.accordId')
      .selectAll('fragranceAccordScores')
      .select([
        'accords.id as id',
        'accords.id as accordId',
        'accords.name as accordName',
        'accords.color as accordColor',
        'accords.description as accordDescription'
      ])
      .where('accords.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    if (pagination != null) {
      query = this.paginatedAccordsQuery(pagination, query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  private paginatedAccordsQuery<C, R>(
    input: CursorPaginationInput<C>,
    qb: SelectQueryBuilder<DB, 'fragranceAccordScores' | 'accords', R>
  ) {
    const { first, column, operator, direction, cursor } = input

    const parsedColumn = `fragranceAccordScores.${column}` as ReferenceExpression<DB, 'fragranceAccordScores'>
    const idColumn = 'fragranceAccordScores.accordId'

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
      .limit(first)
  }
}