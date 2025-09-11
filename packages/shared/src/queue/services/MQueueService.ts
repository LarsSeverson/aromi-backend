import type { DataSources } from '@src/datasources/index.js'
import { type Job, Queue } from 'bullmq'
import type { JobPayload, EnqueueParams, QueueName, JobPayloadKey } from '../types.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import { MQueueBatch } from './MQueueBatch.js'

export abstract class MQueueService<
  J extends JobPayloadKey,
  M extends JobPayload<J>
> {
  private readonly queue: Queue
  private readonly redis: DataSources['redis']

  constructor (
    sources: DataSources,
    queueName: QueueName
  ) {
    this.redis = sources.redis
    this.queue = new Queue(queueName, { connection: this.redis.client })
  }

  abstract getJobId<K extends J>(
    jobName: K,
    data: M[K]
  ): string

  enqueue <K extends J>(
    params: EnqueueParams<M, K>
  ): ResultAsync<Job, BackendError> {
    const { jobName, data } = params
    const jobId = this.getJobId(jobName, data)

    return ResultAsync
      .fromPromise(
        this
          .queue
          .add(
            jobName,
            data,
            { jobId, removeOnComplete: true, removeOnFail: true }
          ),
        error => BackendError.fromMQ(error)
      )
  }

  batch (): MQueueBatch<J, M> {
    return new MQueueBatch(this)
  }
}
