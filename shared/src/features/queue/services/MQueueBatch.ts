import { ResultAsync } from 'neverthrow'
import { type JobPayloadKey, type EnqueueParams, type JobPayload } from '../types'
import { type MQueueService } from './MQueueService'
import { type Job } from 'bullmq'
import { type ApiError } from '@src/utils/error'

export class MQueueBatch<
  J extends JobPayloadKey,
  M extends JobPayload<J>
> {
  private readonly queue: MQueueService<J, M>
  private readonly jobs: Array<ResultAsync<Job, ApiError>> = []

  constructor (queue: MQueueService<J, M>) {
    this.queue = queue
  }

  enqueue <K extends J>(
    params: EnqueueParams<M, K>
  ): this {
    this.jobs.push(this.queue.enqueue(params))
    return this
  }

  run (): ResultAsync<Job[], ApiError> {
    return ResultAsync.combine(this.jobs)
  }
}
