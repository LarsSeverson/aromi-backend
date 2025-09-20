import type { BackendError } from '@aromi/shared'
import { JobHandler } from '@src/jobs/JobHandler.js'
import type { Job } from 'bullmq'
import { ResultAsync } from 'neverthrow'

export abstract class BaseIndexer<I, O> extends JobHandler<I> {
  abstract index (job: Job<I>): Promise<O>

  handle (job: Job<I>): ResultAsync<O, BackendError> {
    return ResultAsync.fromPromise(this.index(job), error => error as BackendError)
  }
}