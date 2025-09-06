import { type DataSources } from '@src/datasources'
import { type Job, Queue } from 'bullmq'
import { type JobPayload, type EnqueueParams, type QueueName } from '../types'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/utils/error'
import { MQueueBatch } from './MQueueBatch'

export abstract class MQueueService<M extends JobPayload<string>> {
  private readonly queue: Queue
  private readonly redis: DataSources['redis']

  constructor (
    sources: DataSources,
    queueName: QueueName
  ) {
    this.redis = sources.redis
    this.queue = new Queue(queueName, { connection: this.redis.client })
  }

  private getJobId<J extends keyof M & string>(
    jobName: J,
    data: M[J]
  ): string {
    return `${jobName}:${data.id}`
  }

  enqueue <J extends keyof M & string>(
    params: EnqueueParams<M, J>
  ): ResultAsync<Job, ApiError> {
    const { jobName, data } = params
    const jobId = this.getJobId(jobName, data)

    return ResultAsync
      .fromPromise(
        this
          .queue
          .add(
            jobName,
            data,
            { jobId, removeOnComplete: true }
          ),
        error => ApiError.fromMQ(error)
      )
  }

  batch (): MQueueBatch<M> {
    return new MQueueBatch(this)
  }
}
