import type { SelectQueryBuilder, ReferenceExpression, ExpressionOrFactory, SqlBool, UpdateObject, ExpressionBuilder } from 'kysely'
import type { CursorPaginationInput, ServicableTablesMatching } from '../types.js'
import { Table } from './Table.js'
import type { DB } from '../db-schema.js'

export class FeaturedTable<R, T extends ServicableTablesMatching<R> = ServicableTablesMatching<R>> extends Table<R, T> {
  paginatedQuery<C>(
    input: CursorPaginationInput<C>,
    qb: SelectQueryBuilder<DB, T, R> = this.baseQuery
  ) {
    const { first, column, operator, direction, cursor } = input

    const parsedColumn = `${this.tableName}.${column}` as ReferenceExpression<DB, T>
    const idColumn = `${this.tableName}.id` as ReferenceExpression<DB, T>

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
      .limit(first + 1) as SelectQueryBuilder<DB, T, R>
  }

  softDelete (
    where: ExpressionOrFactory<DB, T, SqlBool>
  ) {
    return this.update(
      where,
      { deletedAt: new Date().toISOString() } as unknown as UpdateObject<DB, T>
    )
  }

  filterDeleted (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ) {
    const check = `${this.tableName}.deletedAt` as ReferenceExpression<DB, T>
    return (eb: ExpressionBuilder<DB, T>) =>
      where != null
        ? eb.and([
          eb(check, 'is', null),
          typeof where === 'function' ? where(eb) : where
        ])
        : eb(check, 'is', null)
  }
}