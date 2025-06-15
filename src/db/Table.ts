import { type ApiDataSources } from '@src/datasources/datasources'
import { type DB } from '@src/db/schema'
import { type ExpressionOrFactory, type InsertQueryBuilder, type SqlBool, type SelectQueryBuilder, type Selectable, type ReferenceExpression, type TableExpressionOrList } from 'kysely'
import { type InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser'
import { type PaginationParams } from '../factories/PaginationFactory'
import { type DBAny } from '@src/common/types'

export type Row<T extends keyof DB> = Selectable<DB[T]> & { id: number }
export type WhereArgs<TB extends keyof DB, R> = Parameters<SelectQueryBuilder<DB, TB, R>['where']>

export type BaseQueryFactory<R> = () => SelectQueryBuilder<DB, DBAny, R>

export type ExtendSelectFn<
  TB extends keyof DB,
  R,
  QB extends SelectQueryBuilder<DB, TB, R> = SelectQueryBuilder<DB, TB, R>
> = (qb: QB) => QB

export type ExtendInsertFn<T extends keyof DB, R> = (
  qb: InsertQueryBuilder<DB, T, R>
) => InsertQueryBuilder<DB, T, R>

export class Table<T extends keyof DB, R> {
  private readonly db: ApiDataSources['db']
  private readonly table: T

  private alias?: string
  private baseQueryFactory?: BaseQueryFactory<R>

  constructor (
    db: ApiDataSources['db'],
    table: T,
    alias?: string
  ) {
    this.db = db
    this.table = table
    this.alias = alias
  }

  get baseQuery (): SelectQueryBuilder<DB, T, R> {
    if (this.baseQueryFactory != null) return this.baseQueryFactory()
    return this
      .db
      .selectFrom(this.from())
      .selectAll() as SelectQueryBuilder<DB, T, R>
  }

  setBaseQueryFactory (
    factory: BaseQueryFactory<R>
  ): this {
    this.baseQueryFactory = factory
    return this
  }

  setAlias (
    alias: string
  ): this {
    this.alias = alias
    return this
  }

  create (
    values: Partial<R>,
    extend?: ExtendInsertFn<T, R>
  ): InsertQueryBuilder<DB, T, R> {
    const kyValues = values as InsertExpression<DB, T>

    const qb = this
      .db
      .insertInto(this.table)
      .values(kyValues)
      .returningAll() as InsertQueryBuilder<DB, T, R>

    return extend != null ? extend(qb) : qb
  }

  find (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ): SelectQueryBuilder<DB, T, R> {
    let query = this.baseQuery

    if (where != null) {
      query = query.where(where)
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

  paginatedQuery <C>(
    paginationParams: PaginationParams<C>,
    qb: SelectQueryBuilder<DB, T, R> = this.baseQuery
  ): SelectQueryBuilder<DB, T, R> {
    const alias = this.alias ?? this.table
    const { first, column, operator, direction, cursor } = paginationParams

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
