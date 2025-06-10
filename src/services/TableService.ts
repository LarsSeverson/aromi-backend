import { type ApiDataSources } from '@src/datasources/datasources'
import { ApiService } from './ApiService'
import { Table, type Row } from '../db/Table'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type ExpressionOrFactory, type SqlBool } from 'kysely'
import { type DB } from '@src/db/schema'
import { type InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser'
import { type PaginationParams } from '@src/factories/PaginationFactory'

export interface QueryOptions<C> {
  pagination: PaginationParams<C>
}

export abstract class TableService<T extends keyof DB, R extends Row<T>> extends ApiService {
  protected readonly Table: Table<T, R>

  constructor (
    sources: ApiDataSources,
    table: T
  ) {
    super(sources)
    this.Table = new Table<T, R>(sources.db, table)
  }

  create (
    values: InsertExpression<DB, T>
  ): ResultAsync<R, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .create(values)
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
    options?: QueryOptions<C>
  ): ResultAsync<R[], ApiError> {
    const { pagination } = options ?? {}

    let query = this
      .Table
      .find(where)

    if (pagination != null) {
      query = this
        .Table
        .paginatedQuery(pagination, query)
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
}

export interface MyVote { myVote: number | null }
