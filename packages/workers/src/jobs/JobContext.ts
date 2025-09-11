import { type BackendError, type DataSources, throwError } from '@aromi/shared'
import { ResultAsync } from 'neverthrow'
import { JobServices } from './JobServices.js'

export class JobContext {
  readonly sources: DataSources
  readonly services: JobServices

  constructor (sources: DataSources) {
    this.sources = sources
    this.services = new JobServices(sources)
  }

  withTransaction<R>(
    fn: (ctx: this) => ResultAsync<R, BackendError>
  ): ResultAsync<R, BackendError> {
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
        error => error as BackendError
      )
  }

  private createTrxContext (trx: DataSources['db']): this {
    const Ctor = this.constructor as new (sources: DataSources) => this
    const sources = this.sources.with({ db: trx })
    return new Ctor(sources)
  }
}
