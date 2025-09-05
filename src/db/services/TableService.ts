import { type ExtendInsertFn, Table, type ExtendSelectFn, type UpdateValuesFn, type OnConflictFn } from './Table'
import { errAsync, ResultAsync } from 'neverthrow'
import { ApiError, throwError } from '@src/utils/error'
import { type ExpressionOrFactory, type SqlBool } from 'kysely'
import { type DataSources } from '@src/datasources'
import { type CursorPaginationInput } from '@src/server/factories/CursorPaginationFactory'
import { type InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser'
import { type DB } from '@generated/db-schema'

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

  withTransaction <U>(
    fn: (service: this) => ResultAsync<U, ApiError>
  ): ResultAsync<U, ApiError> {
    const db = this.db

    return ResultAsync
      .fromPromise(
        db
          .transaction()
          .execute(async trx => {
            const Ctor = this.constructor as new (sources: DataSources, table: T) => this
            const service = new Ctor({ ...this.sources, db: trx }, this.Table.tableName)

            return await fn(service)
              .match(
                v => v,
                throwError
              )
          }),
        error => ApiError.fromDatabase(error)
      )
  }

  build (): typeof this.db {
    return this.db
  }

  create (
    values: InsertExpression<DB, T>,
    extend?: ExtendInsertFn<T, R>
  ): ResultAsync<R, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .create(values, extend)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error)
      )
  }

  update (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: UpdateValuesFn<T>
  ): ResultAsync<R[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .update(where, values)
          .execute(),
        error => ApiError.fromDatabase(error)
      )
  }

  updateOne (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: UpdateValuesFn<T>
  ): ResultAsync<R, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .update(where, values)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error)
      )
  }

  upsert (
    values: InsertExpression<DB, T>,
    onConflict: OnConflictFn<T>
  ): ResultAsync<R, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .upsert(values, onConflict)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error)
      )
  }

  softDeleteOne (
    where: ExpressionOrFactory<DB, T, SqlBool>
  ): ResultAsync<R, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .softDelete(where)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error)
      )
  }

  softDelete (
    where: ExpressionOrFactory<DB, T, SqlBool>
  ): ResultAsync<R[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .softDelete(where)
          .execute(),
        error => ApiError.fromDatabase(error)
      )
  }

  findOne (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ): ResultAsync<R, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .findOne(where)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error)
      )
  }

  find <C>(
    where?: ExpressionOrFactory<DB, T, SqlBool>,
    options?: QueryOptions<T, R, C>
  ): ResultAsync<R[], ApiError> {
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
        error => ApiError.fromDatabase(error)
      )
  }

  findOrCreate (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: InsertExpression<DB, T>
  ): ResultAsync<R, ApiError> {
    return this
      .findOne(where)
      .orElse(error => {
        if (error.status === 404) {
          return this.create(values)
        }

        return errAsync(error)
      })
  }

  paginate <C>(
    input: CursorPaginationInput<C>
  ): ResultAsync<R[], ApiError> {
    const query = this
      .Table
      .paginatedQuery(input)

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error)
      )
  }
}
