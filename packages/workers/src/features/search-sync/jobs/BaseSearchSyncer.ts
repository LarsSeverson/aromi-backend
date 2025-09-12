import type { BackendError } from '@aromi/shared'
import type { JobContext } from '@src/jobs/JobContext.js'
import { JobHandler } from '@src/jobs/JobHandler.js'
import type { Job } from 'bullmq'
import type { ResultAsync } from 'neverthrow'

export abstract class BaseSearchSyncer<I, O> extends JobHandler<I> {
  abstract sync (job: Job<I>): ResultAsync<O, BackendError>

  handle (job: Job<I>): ResultAsync<O, BackendError> {
    return this.sync(job)
  }

  withTransaction<T> (
    fn: (syncer: this) => ResultAsync<T, BackendError>
  ): ResultAsync<T, BackendError> {
    return this
      .context
      .withTransaction(ctx => {
        const syncer = this.createTrxContext(ctx)
        return fn(syncer)
      })
  }

  private createTrxContext (trx: JobContext): this {
    const Ctor = this.constructor as new (context: JobContext) => this
    return new Ctor(trx)
  }
}