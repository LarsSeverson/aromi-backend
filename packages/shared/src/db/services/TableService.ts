import { errAsync, ResultAsync } from 'neverthrow'
import { BackendError, throwError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool, UpdateObject, ExpressionBuilder, InsertObject, ReferenceExpression } from 'kysely'
import type { DataSources } from '@src/datasources/index.js'
import type { DB } from '@src/db/index.js'
import type { TablesMatching } from '../types.js'
import { Table } from './Table.js'

export abstract class TableService<R, T extends TablesMatching<R> = TablesMatching<R>> {
  private readonly sources: DataSources
  protected readonly db: DataSources['db']
  readonly Table: Table<R, T>

  constructor (
    sources: DataSources,
    tableName: T
  ) {
    this.sources = sources
    this.db = sources.db
    this.Table = new Table(sources.db, tableName)
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
      db
        .transaction()
        .execute(async trx => {
          const service = this.createTrxService(trx)
          return await fn(service)
        }),
      error => error as BackendError
    )
  }

  withExistingTransaction <O>(
    trx: DataSources['db'],
    fn: (service: this) => ResultAsync<O, BackendError>
  ): ResultAsync<O, BackendError> {
    const service = this.createTrxService(trx)
    return fn(service)
  }

  withParentTransaction <O, PR>(
    parent: TableService<PR>,
    fn: (service: this) => ResultAsync<O, BackendError>
  ): ResultAsync<O, BackendError> {
    return this.withExistingTransaction(parent.connection, fn)
  }

  build (): typeof this.db {
    return this.db
  }

  createOne (
    values: InsertObject<DB, T>
  ): ResultAsync<R, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .create(values)
          .executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
      )
  }

  create (
    values: InsertObject<DB, T> | Array<InsertObject<DB, T>>
  ): ResultAsync<R[], BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .Table
          .create(values)
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
    if (typeof values === 'object' && Object.values(values).length === 0) {
      return this.findOne(where)
    }

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
    onConflict: Parameters<typeof this.Table.upsert>[1]
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

  find (
    where?: ExpressionOrFactory<DB, T, SqlBool>
  ): ResultAsync<R[], BackendError> {
    const query = this
      .Table
      .find(where)

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  findDistinct (
    where?: ExpressionOrFactory<DB, T, SqlBool>,
    distinctOn?: ReferenceExpression<DB, T>
  ): ResultAsync<R[], BackendError> {
    const query = this
      .Table
      .findDistinct(where, distinctOn)

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
        if (error.status === 404) return this.createOne(values)
        return errAsync(error)
      })
  }

  private createTrxService (trx: DataSources['db']): this {
    const Ctor = this.constructor as new (sources: DataSources, table: T) => this
    const sources = this.sources.with({ db: trx })
    return new Ctor(sources, this.Table.tableName)
  }
}
