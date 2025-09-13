import type { ExpressionOrFactory, SqlBool, ExpressionBuilder, SelectQueryBuilder, InsertObject, InsertQueryBuilder, UpdateQueryBuilder, UpdateObject, OnConflictBuilder, OnConflictUpdateBuilder, OnConflictDatabase, OnConflictTables, OnConflictDoNothingBuilder } from 'kysely'
import type { DB } from '@src/db/index.js'
import type { DataSources } from '@src/datasources/index.js'
import type { TablesMatching } from '../types.js'

export class Table<R, T extends TablesMatching<R> = TablesMatching<R>> {
  private readonly db: DataSources['db']
  readonly tableName: T

  constructor (
    db: DataSources['db'],
    tableName: T
  ) {
    this.db = db
    this.tableName = tableName
  }

  get baseQuery () {
    return this
      .db
      .selectFrom(this.tableName)
      .selectAll() as SelectQueryBuilder<DB, T, R>
  }

  get connection () {
    return this.db
  }

  create (
    values: InsertObject<DB, T> | Array<InsertObject<DB, T>>
  ) {
    return this.db
      .insertInto(this.tableName)
      .values(values)
      .returningAll() as InsertQueryBuilder<DB, T, R>
  }

  update (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: UpdateObject<DB, T> | ((eb: ExpressionBuilder<DB, T>) => UpdateObject<DB, T>)
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return this.db
      .updateTable(this.tableName)
      // @ts-expect-error kysely unions are overcomplex for something this simple
      .set(values)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .where(where)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .returningAll() as UpdateQueryBuilder<DB, T, T, R>
  }

  upsert (
    values: InsertObject<DB, T> | Array<InsertObject<DB, T>> | ((eb: ExpressionBuilder<DB, T>) => InsertObject<DB, T>),
    onConflict: (builder: OnConflictBuilder<DB, T>) => OnConflictUpdateBuilder<OnConflictDatabase<DB, T>, OnConflictTables<T>> | OnConflictDoNothingBuilder<DB, T>
  ) {
    return this
      .db
      .insertInto(this.tableName)
      .values(values)
      .onConflict(onConflict)
      .returningAll() as InsertQueryBuilder<DB, T, R>
  }

  find (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ) {
    let qb = this.baseQuery
    if (where != null) qb = qb.where(where)
    return qb
  }

  findOne (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ) {
    return this
      .find(where)
      .limit(1)
  }
}
