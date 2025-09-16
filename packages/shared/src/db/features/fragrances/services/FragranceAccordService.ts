import type { CombinedFragranceAccordRow, FragranceAccordRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import type { ExpressionOrFactory, SelectQueryBuilder, SqlBool, ReferenceExpression } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { CursorPaginationInput } from '@src/db/types.js'

export class FragranceAccordService extends FeaturedTableService<FragranceAccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceAccords')
  }

  findAccords <C>(
    where?: ExpressionOrFactory<DB, 'fragranceAccords' | 'accords', SqlBool>,
    pagination?: CursorPaginationInput<C>
  ): ResultAsync<CombinedFragranceAccordRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('accords', 'accords.id', 'fragranceAccords.accordId')
      .selectAll('fragranceAccords')
      .select([
        'accords.id as accordId',
        'accords.name as accordName',
        'accords.color as accordColor',
        'accords.description as accordDescription'
      ])
      .where('fragranceAccords.deletedAt', 'is', null)
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
    qb: SelectQueryBuilder<DB, 'fragranceAccords' | 'accords', R>
  ) {
    const { first, column, operator, direction, cursor } = input

    const parsedColumn = `fragranceAccords.${column}` as ReferenceExpression<DB, 'fragranceAccords'>
    const idColumn = 'fragranceAccords.id'

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
