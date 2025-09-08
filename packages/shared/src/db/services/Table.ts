import { type DB } from '@src/db/index.js'
import { type ExpressionOrFactory, type InsertQueryBuilder, type SqlBool, type SelectQueryBuilder, type Selectable, type ReferenceExpression, type TableExpressionOrList, type UpdateQueryBuilder, type OnConflictBuilder, type OnConflictUpdateBuilder, type OnConflictDatabase, type OnConflictTables, type Insertable, type Updateable } from 'kysely'
import { type DBAny } from '@src/utils/util-types.js'
import { type DataSources } from '@src/datasources/index.js'
import { type CursorPaginationInput } from '../types.js'

export type Row<T extends keyof DB> = Selectable<DB[T]> & { id: string, deletedAt: Date | null }
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

export type OnConflictFn<T extends keyof DB> = (oc: OnConflictBuilder<DB, T>) => OnConflictUpdateBuilder<OnConflictDatabase<DB, T>, OnConflictTables<T>>

export class Table<T extends keyof DB, R> {
  private readonly db: DataSources['db']
  readonly tableName: T

  private alias?: string
  private baseQueryFactory?: BaseQueryFactory<R>

  constructor (
    db: DataSources['db'],
    table: T,
    alias?: string
  ) {
    this.db = db
    this.tableName = table
    this.alias = alias
  }

  get baseQuery (): SelectQueryBuilder<DB, T, R> {
    if (this.baseQueryFactory != null) return this.baseQueryFactory()
    return this
      .db
      .selectFrom(this.from())
      .selectAll() as unknown as SelectQueryBuilder<DB, T, R>
  }

  get connection (): DataSources['db'] {
    return this.db
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
    values: Insertable<DB[T]> | Array<Insertable<DB[T]>>,
    extend?: ExtendInsertFn<T, R>
  ): InsertQueryBuilder<DB, T, R> {
    const qb = this
      .db
      .insertInto(this.tableName)
      .values(values)
      .returningAll() as InsertQueryBuilder<DB, T, R>

    return extend != null ? extend(qb) : qb
  }

  update (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: Updateable<DB[T]>
  ): UpdateQueryBuilder<DB, T, T, R> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const qb = this
      .db
      .updateTable(this.tableName)
      // @ts-expect-error kysely unions are overcomplex for something this simple
      .set(values)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .where(where)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .returningAll() as UpdateQueryBuilder<DB, T, T, R>

    return qb
  }

  upsert (
    values: Insertable<DB[T]> | Array<Insertable<DB[T]>>,
    onConflict: OnConflictFn<T>
  ): InsertQueryBuilder<DB, T, R> {
    const qb = this
      .db
      .insertInto(this.tableName)
      .values(values)
      .onConflict(onConflict)
      .returningAll()

    return qb as InsertQueryBuilder<DB, T, R>
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
    input: CursorPaginationInput<C>,
    qb: SelectQueryBuilder<DB, T, R> = this.baseQuery
  ): SelectQueryBuilder<DB, T, R> {
    const alias = this.alias ?? this.tableName
    const { first, column, operator, direction, cursor } = input

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

  softDelete (
    where: ExpressionOrFactory<DB, T, SqlBool>
  ): UpdateQueryBuilder<DB, T, T, R> {
    return this
      .update(
        where,
        { deletedAt: new Date() } as unknown as Updateable<DB[T]>
      )
  }

  filterDeleted (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ): ExpressionOrFactory<DB, T, SqlBool> {
    const tableRef = this.alias ?? this.tableName
    const check = `${tableRef}.deletedAt` as ReferenceExpression<DB, T>

    return (eb) => where != null
      ? eb
        .and([
          eb(check, 'is', null),
          typeof where === 'function' ? where(eb) : where
        ])
      : eb(check, 'is', null)
  }

  private from (): TableExpressionOrList<DB, never> {
    const from = (this.alias != null
      ? `${this.tableName} as ${this.alias}`
      : this.tableName) as TableExpressionOrList<DB, never>

    return from
  }
}
