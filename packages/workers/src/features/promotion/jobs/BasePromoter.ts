import type { ApiError } from '@aromi/shared'
import type { JobContext } from '@src/jobs/JobContext.js'
import { JobHandler } from '@src/jobs/JobHandler.js'
import type { Job } from 'bullmq'
import type { ResultAsync } from 'neverthrow'

export abstract class BasePromoter<I, O> extends JobHandler<I> {
  abstract promote (job: Job<I>): ResultAsync<O, ApiError>

  handle (job: Job<I>): ResultAsync<O, ApiError> {
    return this.promote(job)
  }

  withTransaction<T> (
    fn: (promoter: this) => ResultAsync<T, ApiError>
  ): ResultAsync<T, ApiError> {
    return this
      .context
      .withTransaction(ctx => {
        const promoter = this.createTrxContext(ctx)
        return fn(promoter)
      })
  }

  private createTrxContext (trx: JobContext): this {
    const Ctor = this.constructor as new (context: JobContext) => this
    return new Ctor(trx)
  }
}
