import type { ApiError, DataSources } from '@aromi/shared'
import { JobContext } from './JobContext.js'
import type { Job } from 'bullmq'
import type { ResultAsync } from 'neverthrow'

export abstract class JobHandler<T> {
  protected readonly context: JobContext

  constructor (sources: DataSources) {
    this.context = new JobContext(sources)
  }

  abstract handle (job: Job<T>): ResultAsync<unknown, ApiError>
}
