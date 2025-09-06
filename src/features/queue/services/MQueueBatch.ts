import { ResultAsync } from 'neverthrow'
import { type EnqueueParams, type JobPayload } from '../types'
import { type MQueueService } from './MQueueService'
import { type Job } from 'bullmq'
import { type ApiError } from '@src/utils/error'

export class MQueueBatch<M extends JobPayload<string>> {
  private readonly queue: MQueueService<M>
  private readonly jobs: Array<ResultAsync<Job, ApiError>> = []

  constructor (queue: MQueueService<M>) {
    this.queue = queue
  }

  enqueue <J extends keyof M & string>(
    params: EnqueueParams<M, J>
  ): this {
    this.jobs.push(this.queue.enqueue(params))
    return this
  }

  run (): ResultAsync<Job[], ApiError> {
    return ResultAsync.combine(this.jobs)
  }
}
