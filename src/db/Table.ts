import { type PaginationParams } from '@src/common/pagination'
import { type SortColumn } from '@src/common/types'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type DB } from '@src/db/schema'
import { type ExpressionOrFactory, type SqlBool, type SelectQueryBuilder, type Selectable, type ReferenceExpression, type TableExpressionOrList, type InsertQueryBuilder } from 'kysely'
import { type InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser'

export type Row<T extends keyof DB> = Selectable<DB[T]> & { id: number }
// export type TableNameFor<R extends Row> = { [K in keyof DB]: Selectable<DB[K]> extends R ? (R extends Selectable<DB[K]> ? K : never) : never }[keyof DB]
export type WhereArgs<TB extends keyof DB, R extends Row<TB>> = Parameters<SelectQueryBuilder<DB, TB, R>['where']>

export class Table<T extends keyof DB, R extends Row<T>> {
  private db!: ApiDataSources['db']
  private readonly table: T
  private readonly alias?: string

  constructor (
    table: T,
    alias?: string
  ) {
    this.table = table
    this.alias = alias
  }

  setDb (db: ApiDataSources['db']): this {
    this.db = db
    return this
  }

  create (
    values: InsertExpression<DB, T>
  ): InsertQueryBuilder<DB, T, R> {
    const query = this
      .db
      .insertInto(this.table)
      .values(values)
      .returningAll()

    return query as unknown as InsertQueryBuilder<DB, T, R>
  }

  find (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ): SelectQueryBuilder<DB, T, R> {
    const query = this
      .db
      .selectFrom(this.from())
      .selectAll() as unknown as SelectQueryBuilder<DB, T, R>

    if (where != null) {
      query.where(where)
    }

    return query
  }

  findOne (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ): SelectQueryBuilder<DB, T, R> {
    return this
      .find(where)
      .limit(1)
  }

  paginatedQuery <P extends SortColumn>(
    qb: SelectQueryBuilder<DB, T, R>,
    params: PaginationParams<P>
  ): SelectQueryBuilder<DB, T, R> {
    const alias = this.alias ?? this.table
    const { first, cursor, sortParams } = params
    const { column, operator, direction } = sortParams

    const parsedColumn = `${alias}.${column}` as ReferenceExpression<DB, T>
    const idColumn = `${alias}.id` as ReferenceExpression<DB, T>

    return qb
      .$if(cursor.isValid, qb =>
        qb
          .where(({ eb, or, and }) =>
            or([
              eb(parsedColumn, operator, cursor.value),
              and([
                eb(parsedColumn, '=', cursor.value),
                eb(idColumn, operator, cursor.lastId)
              ])
            ])
          )
      )
      .orderBy(parsedColumn, direction)
      .orderBy(idColumn, direction)
      .limit(first + 1)
  }

  private from (): TableExpressionOrList<DB, never> {
    const from = (this.alias != null
      ? `${this.table} as ${this.alias}`
      : this.table) as TableExpressionOrList<DB, never>

    return from
  }
}
