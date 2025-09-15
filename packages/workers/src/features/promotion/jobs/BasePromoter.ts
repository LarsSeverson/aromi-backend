import type { BackendError, DataSources } from '@aromi/shared'
import type { JobContext } from '@src/jobs/JobContext.js'
import { JobHandler } from '@src/jobs/JobHandler.js'
import type { Job } from 'bullmq'
import type { ResultAsync } from 'neverthrow'

export abstract class BasePromoter<I, O> extends JobHandler<I> {
  abstract promote (job: Job<I>): ResultAsync<O, BackendError>

  handle (job: Job<I>): ResultAsync<O, BackendError> {
    return this.promote(job)
  }

  withTransaction<T> (
    fn: (promoter: this) => ResultAsync<T, BackendError>
  ): ResultAsync<T, BackendError> {
    return this
      .context
      .withTransaction(ctx => {
        const promoter = this.createTrxContext(ctx)
        return fn(promoter)
      })
  }

  private createTrxContext (trx: JobContext): this {
    const Ctor = this.constructor as new (sources: DataSources) => this
    const promoter = new Ctor(trx.sources)
    return promoter
  }
}
