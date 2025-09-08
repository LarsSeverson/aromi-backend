import { type DataSources } from 'shared/src/datasources'
import { JobServices } from './JobServices'
import { ResultAsync } from 'neverthrow'
import { ApiError, throwError } from '@src/utils/error'

export class JobContext {
  readonly sources: DataSources
  readonly services: JobServices

  constructor (sources: DataSources) {
    this.sources = sources
    this.services = new JobServices(sources)
  }

  withTransaction<R>(
    fn: (ctx: this) => ResultAsync<R, ApiError>
  ): ResultAsync<R, ApiError> {
    const { db } = this.sources

    return ResultAsync
      .fromPromise(
        db
          .transaction()
          .execute(async trx => {
            const trxContext = this.createTrxContext(trx)
            return await fn(trxContext)
              .match(
                ok => ok,
                throwError
              )
          }),
        error => ApiError.fromDatabase(error)
      )
  }

  private createTrxContext (trx: DataSources['db']): this {
    const Ctor = this.constructor as new (sources: DataSources) => this
    const sources = { ...this.sources, db: trx }
    return new Ctor(sources)
  }
}
