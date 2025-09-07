import { type JobPayloadKey, type JobPayload, type QueueName } from '@src/features/queue'
import { type Job, Worker } from 'bullmq'
import { WorkerRegistry } from './WorkerRegistry'
import { ApiError, throwError } from '@src/utils/error'
import { type JobHandler } from '../jobs/JobHandler'

export abstract class WorkerService<J extends JobPayloadKey, M extends JobPayload<J>> {
  private readonly queueName: QueueName
  private readonly worker: Worker

  private readonly registry = new WorkerRegistry<J, M>()

  constructor (queueName: QueueName) {
    this.queueName = queueName

    this.worker = new Worker(
      this.queueName,
      this.processJob.bind(this)
    )

    this.worker
      .on('completed', this.onCompleted.bind(this))
      .on('failed', this.onFailed.bind(this))
  }

  protected register<K extends J>(
    jobName: K,
    handler: JobHandler<M[K]>
  ): this {
    this.registry.register(jobName, handler)
    return this
  }

  protected onCompleted (job: Job): this {
    console.info(`
      WorkerService:
      [Queue ${this.queueName}]
      [Job ${job.id} - ${job.name}]: completed
    `)

    return this
  }

  protected onFailed (job: Job | undefined, error: Error): this {
    const jobName = job?.name ?? 'unknown'
    const jobId = job?.id ?? 'unknown'

    console.error(`
      WorkerServiceError:
      [Queue ${this.queueName}]
      [Job ${jobId} - ${jobName}]: failed
      [Error]: ${error.message}
    `)

    return this
  }

  private async processJob (
    job: Job
  ): Promise<unknown> {
    const handler = this.registry.getHandler(job.name as J)

    if (handler == null) {
      throw new ApiError(
        'NO_JOB_HANDLER',
        `No handler registered for job: ${job.name}`,
        500
      )
    }

    return await handler
      .handle(job as Job<M[J]>)
      .match(
        ok => ok,
        throwError
      )
  }
}
