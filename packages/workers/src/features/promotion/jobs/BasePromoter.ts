import { BackendError, JobStatus, type RequestJobRow, type RequestType, type DataSources, type PromotionJobData } from '@aromi/shared'
import type { JobContext } from '@src/jobs/JobContext.js'
import { JobHandler } from '@src/jobs/JobHandler.js'
import type { Job } from 'bullmq'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

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
    const { requestId } = job.data

    return this
      .startJob(requestId)
      .andThen(
        jobRow => ResultAsync
          .fromPromise(
            this.promote(job),
            error => error as BackendError
          )
          .orTee(error => this.endJob(jobRow.id, error))
          .andTee(_ => this.endJob(jobRow.id))
      )
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
    return this
      .getJobRow(requestId)
      .andThen(jobRow => this.markJobProcessing(jobRow.id))
  }

  private endJob (
    jobId: string,
    error?: BackendError
  ) {
    if (error != null) return this.markJobFailed(jobId, error)
    return this.markJobSuccess(jobId)
  }

  private getJobRow (requestId: string) {
    const { services } = this.context
    const { requestJobs } = services

    return requestJobs
      .findOne(eb => eb('requestId', '=', requestId))
      .andThen(jobRow => this.validateJob(jobRow))
  }

  private validateJob (jobRow: RequestJobRow) {
    if (jobRow.requestType !== this.type) {
      return errAsync(
        new BackendError(
          'INVALID_JOB_TYPE',
          `Expected job of type ${this.type} but got ${jobRow.requestType}`,
          400
        )
      )
    }

    if (jobRow.status !== JobStatus.QUEUED) {
      return errAsync(
        new BackendError(
          'INVALID_JOB_STATUS',
          'Only requests with queued status can be processed',
          400
        )
      )
    }

    return okAsync(jobRow)
  }

  private markJobProcessing (jobId: string) {
    const { services } = this.context
    const { requestJobs } = services

    return requestJobs
      .updateOne(
        eb => eb('id', '=', jobId),
        {
          status: JobStatus.PROCESSING
        }
      )
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
