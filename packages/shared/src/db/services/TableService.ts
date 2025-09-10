import { type ExtendInsertFn, Table, type ExtendSelectFn, type OnConflictFn } from './Table.js'
import { errAsync, ResultAsync } from 'neverthrow'
import { BackendError, throwError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool, UpdateObject, ExpressionBuilder, InsertObject } from 'kysely'
import type { DataSources } from '@src/datasources/index.js'
import type { DB } from '@src/db/index.js'
import type { CursorPaginationInput } from '../types.js'

export interface QueryOptions<T extends keyof DB, R, C> {
  pagination?: CursorPaginationInput<C>
  extend?: ExtendSelectFn<T, R>
}

export abstract class TableService<T extends keyof DB, R> {
  private readonly sources: DataSources
  protected readonly db: DataSources['db']
  protected readonly Table: Table<T, R>

  constructor (
    sources: DataSources,
    table: T
  ) {
    this.sources = sources
    this.db = sources.db
    this.Table = new Table<T, R>(sources.db, table)
  }

  get connection (): DataSources['db'] {
    return this.db
  }

  withTransaction <O>(
    fn: (service: this) => ResultAsync<O, BackendError>
  ): ResultAsync<O, BackendError> {
    const db = this.db

    return ResultAsync
      .fromPromise(
        db
          .transaction()
          .execute(async trx => {
            const service = this.createTrxService(trx)
            return await fn(service)
              .match(
                v => v,
                throwError
              )
          }),
        error => BackendError.fromDatabase(error)
      )
  }

  withTransactionAsync<O>(
    fn: (service: this) => Promise<O>
  ): ResultAsync<O, BackendError> {
    const db = this.db

    return ResultAsync.fromPromise(
      db.transaction().execute(async trx => {
        const service = this.createTrxService(trx)
        return await fn(service)
      }),
      error => BackendError.fromDatabase(error)
    )
  }

  withExistingTransaction <O>(
    trx: DataSources['db'],
    fn: (service: this) => ResultAsync<O, BackendError>
  ): ResultAsync<O, BackendError> {
    const service = this.createTrxService(trx)
    return fn(service)
  }

  withParentTransaction <O, PT extends keyof DB, PR>(
    parent: TableService<PT, PR>,
    fn: (service: this) => ResultAsync<O, BackendError>
  ): ResultAsync<O, BackendError> {
    return this.withExistingTransaction(parent.connection, fn)
  }

  build (): typeof this.db {
    return this.db
  }

  createOne (
    values: InsertObject<DB, T>,
    extend?: ExtendInsertFn<T, R>
  ): ResultAsync<R, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .create(values, extend)
          .executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
      )
  }

  create (
    values: InsertObject<DB, T> | Array<InsertObject<DB, T>>,
    extend?: ExtendInsertFn<T, R>
  ): ResultAsync<R[], BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .create(values, extend)
          .execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  update (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: UpdateObject<DB, T>
  ): ResultAsync<R[], BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .update(where, values)
          .execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  updateOne (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: UpdateObject<DB, T> | ((eb: ExpressionBuilder<DB, T>) => UpdateObject<DB, T>)
  ): ResultAsync<R, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .update(where, values)
          .executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
      )
  }

  upsert (
    values: InsertObject<DB, T> | Array<InsertObject<DB, T>> | ((eb: ExpressionBuilder<DB, T>) => InsertObject<DB, T>),
    onConflict: OnConflictFn<T>
  ): ResultAsync<R, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .upsert(values, onConflict)
          .executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
      )
  }

  softDeleteOne (
    where: ExpressionOrFactory<DB, T, SqlBool>
  ): ResultAsync<R, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .softDelete(where)
          .executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
      )
  }

  softDelete (
    where: ExpressionOrFactory<DB, T, SqlBool>
  ): ResultAsync<R[], BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .softDelete(where)
          .execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  findOne (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ): ResultAsync<R, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .findOne(where)
          .executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
      )
  }

  find <C>(
    where?: ExpressionOrFactory<DB, T, SqlBool>,
    options?: QueryOptions<T, R, C>
  ): ResultAsync<R[], BackendError> {
    const { pagination, extend } = options ?? {}

    let query = this
      .Table
      .find(this.Table.filterDeleted(where))

    if (pagination != null) {
      query = this
        .Table
        .paginatedQuery(pagination, query)
    }

    if (extend != null) {
      query = extend(query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  findOrCreate (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: InsertObject<DB, T>
  ): ResultAsync<R, BackendError> {
    return this
      .findOne(where)
      .orElse(error => {
        if (error.status === 404) {
          return this.createOne(values)
        }

        return errAsync(error)
      })
  }

  paginate <C>(
    input: CursorPaginationInput<C>
  ): ResultAsync<R[], BackendError> {
    const query = this
      .Table
      .paginatedQuery(input)

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  private createTrxService (trx: DataSources['db']): this {
    const Ctor = this.constructor as new (sources: DataSources, table: T) => this
    const sources = this.sources.with({ db: trx })
    return new Ctor(sources, this.Table.tableName)
  }
}
