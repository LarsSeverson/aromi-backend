import { type ApiDataSources } from '@src/datasources/datasources'
import { ApiService } from './ApiService'
import { type ExtendInsertFn, Table, type ExtendSelectFn, type UpdateValuesFn } from '../db/Table'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type ReferenceExpression, type ExpressionOrFactory, type SqlBool } from 'kysely'
import { type DB } from '@src/db/schema'
import { type PaginationParams } from '@src/factories/PaginationFactory'

export interface QueryOptions<T extends keyof DB, R, C> {
  pagination?: PaginationParams<C>
  extend?: ExtendSelectFn<T, R>
}

export abstract class TableService<T extends keyof DB, R> extends ApiService {
  protected readonly Table: Table<T, R>

  constructor (
    sources: ApiDataSources,
    table: T
  ) {
    super(sources)
    this.Table = new Table<T, R>(sources.db, table)
  }

  withConnection (db: ApiDataSources['db']): Table<T, R> {
    return this.Table.withConnection(db)
  }

  create (
    values: Partial<R>,
    extend?: ExtendInsertFn<T, R>
  ): ResultAsync<R, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .create(values, extend)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  update (
    where: ExpressionOrFactory<DB, T, SqlBool>,
    values: UpdateValuesFn<T>
  ): ResultAsync<R, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .update(where, values)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
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
        error => ApiError.fromDatabase(error as Error)
      )
  }

  find <C>(
    where?: ExpressionOrFactory<DB, T, SqlBool>,
    options?: QueryOptions<T, R, C>
  ): ResultAsync<R[], ApiError> {
    const { pagination, extend } = options ?? {}

    let query = this
      .Table
      .find(where)

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
        error => ApiError.fromDatabase(error as Error)
      )
  }

  paginate <C>(
    input: PaginationParams<C>
  ): ResultAsync<R[], ApiError> {
    const query = this
      .Table
      .paginatedQuery(input)

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  delete (
    id: number,
    soft = true
  ): ResultAsync<number, ApiError> {
    if (soft) return this.softDelete(id)

    throw new ApiError(
      'NOT_IMPL',
      'Something went wrong on our end',
      500
    )
  }

  private softDelete (
    id: number
  ): ResultAsync<number, ApiError> {
    const values: UpdateValuesFn<T> = {
      deletedAt: new Date()
    } as unknown as UpdateValuesFn<T>

    return this
      .update(
        eb => eb('id' as ReferenceExpression<DB, T>, '=', null),
        values
      )
      .map(() => id)
  }
}

export interface MyVote { myVote: number | null }
