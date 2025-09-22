import { type BackendError, JobStatus, type RequestType, type DataSources, type PromotionJobData, unwrapOrThrow, unwrapOrThrowSync } from '@aromi/shared'
import type { JobContext } from '@src/jobs/JobContext.js'
import { JobHandler } from '@src/jobs/JobHandler.js'
import type { Job } from 'bullmq'
import { ResultAsync } from 'neverthrow'

export interface BasePromoterParams {
  sources: DataSources
  type: RequestType
}

export abstract class BasePromoter<I extends PromotionJobData, O> extends JobHandler<I> {
  protected readonly type: RequestType

  constructor (params: BasePromoterParams) {
    const { sources, type } = params

    super(sources)
    this.type = type
  }

  abstract promote (job: Job<I>): Promise<O>

  handle (job: Job<I>): ResultAsync<O, BackendError> {
    return ResultAsync.fromPromise(
      this.handlePromote(job),
      error => error as BackendError
    )
  }

  async handlePromote (job: Job<I>): Promise<O> {
    const { requestId } = job.data

    const jobRow = await unwrapOrThrow(this.startJob(requestId))

    const result = await ResultAsync.fromPromise(
      this.promote(job),
      error => error as BackendError
    )

    const error = result.isErr() ? result.error : undefined
    await unwrapOrThrow(this.endJob(jobRow.id, error))

    return unwrapOrThrowSync(result)
  }

  withTransaction<T> (
    fn: (promoter: this) => ResultAsync<T, BackendError>
  ): ResultAsync<T, BackendError> {
    return this
      .context
      .withTransaction(ctx => {
        const promoter = this.createTrxContext(ctx)
        return fn(promoter)
      })
  }

  async withTransactionAsync<T> (
    fn: (promoter: this) => Promise<T>
  ): Promise<T> {
    return await this
      .context
      .withTransactionAsync(async ctx => {
        const promoter = this.createTrxContext(ctx)
        return await fn(promoter)
      })
  }

  private startJob (requestId: string) {
    const { services } = this.context
    const { requestJobs } = services

    return requestJobs.createOne({
      requestId,
      requestType: this.type,
      status: JobStatus.PROCESSING
    })
  }

  private endJob (
    jobId: string,
    error?: BackendError
  ) {
    if (error != null) return this.markJobFailed(jobId, error)
    return this.markJobSuccess(jobId)
  }

  private markJobSuccess (jobId: string) {
    const { services } = this.context
    const { requestJobs } = services

    return requestJobs
      .updateOne(
        eb => eb('id', '=', jobId),
        {
          status: JobStatus.SUCCESS,
          processedAt: new Date().toISOString()
        }
      )
  }

  private markJobFailed (
    jobId: string,
    error: BackendError
  ) {
    const { services } = this.context
    const { requestJobs } = services

    return requestJobs
      .updateOne(
        eb => eb('id', '=', jobId),
        {
          status: JobStatus.FAILED,
          error: error.message,
          processedAt: new Date().toISOString()
        }
      )
  }

  private createTrxContext (trx: JobContext): this {
    const Ctor = this.constructor as new (sources: DataSources) => this
    const promoter = new Ctor(trx.sources)
    return promoter
  }
}
