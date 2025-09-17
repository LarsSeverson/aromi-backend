import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { CursorPaginationInput, QueryOptions, ServicableTablesMatching } from '../types.js'
import { TableService } from './TableService.js'
import type { DB } from '../db-schema.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import { FeaturedTable } from './FeaturedTable.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export abstract class FeaturedTableService<R, T extends ServicableTablesMatching<R> = ServicableTablesMatching<R>> extends TableService<R, T> {
  override readonly Table: FeaturedTable<R, T>

  constructor (
    sources: DataSources,
    tableName: T
  ) {
    super(sources, tableName)
    this.Table = new FeaturedTable(sources.db, tableName)
  }

  override find<C>(
    where?: ExpressionOrFactory<DB, T, SqlBool>,
    options?: QueryOptions<C>
  ): ResultAsync<R[], BackendError> {
    const { pagination } = options ?? {}

    let query = this.Table
      .find(this.Table.filterDeleted(where))

    if (pagination != null) {
      query = this.Table.paginatedQuery(pagination, query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  override findOne (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ): ResultAsync<R, BackendError> {
    const query = this
      .Table
      .findOne(this.Table.filterDeleted(where))

    return ResultAsync
      .fromPromise(
        query.executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
      )
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
}