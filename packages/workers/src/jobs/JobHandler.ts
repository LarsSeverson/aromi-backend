import { type Job } from 'bullmq'
import { JobContext } from './JobContext'
import { type ResultAsync } from 'neverthrow'
import { type ApiError } from '@src/utils/error'
import { type DataSources } from 'shared/src/datasources'

export abstract class JobHandler<T> {
  protected readonly context: JobContext

  constructor (sources: DataSources) {
    this.context = new JobContext(sources)
  }

  abstract handle (job: Job<T>): ResultAsync<unknown, ApiError>
}
