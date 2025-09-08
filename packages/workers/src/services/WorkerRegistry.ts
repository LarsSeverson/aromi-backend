import { type JobHandler } from '../jobs/JobHandler'

export class WorkerRegistry<J extends JobPayloadKey, M extends JobPayload<J>> {
  private readonly handlers = new Map<J, JobHandler<M[J]>>()

  register <K extends J>(
    jobName: K,
    handler: JobHandler<M[K]>
  ): this {
    this.handlers.set(jobName, handler)
    return this
  }

  getHandler <K extends J>(
    jobName: K
  ): JobHandler<M[K]> | undefined {
    return this.handlers.get(jobName)
  }
}
