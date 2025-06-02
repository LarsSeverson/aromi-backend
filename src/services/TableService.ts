import { type ApiDataSources } from '@src/datasources/datasources'
import { ApiService } from './apiService'
import { Table, type Row } from '../db/Table'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'
import { type SortColumn } from '@src/common/types'
import { type ExpressionOrFactory, type SqlBool } from 'kysely'
import { type DB } from '@src/db/schema'
import { type InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser'

export interface QueryOptions<P extends SortColumn> {
  pagination?: PaginationParams<P>
}

export abstract class TableService<T extends keyof DB, R extends Row<T>> extends ApiService {
  protected readonly Table: Table<T, R>

  constructor (
    sources: ApiDataSources,
    table: T
  ) {
    super(sources)
    this.Table = new Table<T, R>(table).setDb(sources.db)
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

  find <P extends SortColumn>(
    where?: ExpressionOrFactory<DB, T, SqlBool>,
    options?: QueryOptions<P>
  ): ResultAsync<R[], ApiError> {
    const { pagination } = options ?? {}

    const query = this
      .Table
      .find(where)

    if (pagination != null) {
      this
        .Table
        .paginatedQuery(query, pagination)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }
}
