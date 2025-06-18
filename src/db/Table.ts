import { type ApiDataSources } from '@src/datasources/datasources'
import { type DB } from '@src/db/schema'
import { type ExpressionOrFactory, type InsertQueryBuilder, type SqlBool, type SelectQueryBuilder, type Selectable, type ReferenceExpression, type TableExpressionOrList, type UpdateQueryBuilder, type ExpressionBuilder } from 'kysely'
import { type InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser'
import { type PaginationParams } from '../factories/PaginationFactory'
import { type DBAny } from '@src/common/types'
import { type UpdateObjectExpression } from 'kysely/dist/cjs/parser/update-set-parser'

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

export type UpdateValuesFn<T extends keyof DB> = UpdateObjectExpression<DB, T> | ((eb: ExpressionBuilder<DB, T>) => UpdateObjectExpression<DB, T>)

export class Table<T extends keyof DB, R> {
  private db: ApiDataSources['db']
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

  withConnection (db: ApiDataSources['db']): this {
    this.db = db
    return this
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

  update (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: UpdateValuesFn<T>
  ): UpdateQueryBuilder<DB, T, T, R> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const qb = this
      .db
      .updateTable(this.table)
      // @ts-expect-error kysely unions are overcomplex for something this simple
      .set(values)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .where(where)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .returningAll() as UpdateQueryBuilder<DB, T, T, R>

    return qb
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
