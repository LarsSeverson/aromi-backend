import { BackendError, JobStatus, type DataSources, type EditJobRow, type EditType, type RevisionJobData } from '@aromi/shared'
import type { JobContext } from '@src/jobs/JobContext.js'
import { JobHandler } from '@src/jobs/JobHandler.js'
import type { Job } from 'bullmq'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

export interface BaseReviserParams {
  sources: DataSources
  type: EditType
}

export abstract class BaseReviser<I extends RevisionJobData, O> extends JobHandler<I> {
  protected readonly type: EditType

  constructor (params: BaseReviserParams) {
    const { sources, type } = params

    super(sources)
    this.type = type
  }

  abstract revise (job: Job<I>): Promise<O>

  handle (job: Job<I>): ResultAsync<O, BackendError> {
    const { editId } = job.data

    return this
      .startJob(editId)
      .andThen(
        jobRow => ResultAsync
          .fromPromise(
            this.revise(job),
            error => error as BackendError
          )
          .orTee(error => this.endJob(jobRow.id, error))
          .andTee(_ => this.endJob(jobRow.id))
      )
  }

  withTransaction<T> (
    fn: (reviser: this) => ResultAsync<T, BackendError>
  ): ResultAsync<T, BackendError> {
    return this
      .context
      .withTransaction(ctx => {
        const reviser = this.createTrxContext(ctx)
        return fn(reviser)
      })
  }

  async withTransactionAsync<T> (
    fn: (reviser: this) => Promise<T>
  ): Promise<T> {
    return await this
      .context
      .withTransactionAsync(async ctx => {
        const reviser = this.createTrxContext(ctx)
        return await fn(reviser)
      })
  }

  private startJob (editId: string) {
    return this
      .getJobRow(editId)
      .andThen(jobRow => this.markJobProcessing(jobRow.id))
  }

  private endJob (
    jobId: string,
    error?: BackendError
  ) {
    if (error != null) return this.markJobFailed(jobId, error)
    return this.markJobSuccess(jobId)
  }

  private getJobRow (editId: string) {
    const { services } = this.context
    const { editJobs } = services

    return editJobs
      .findOne(eb => eb('editId', '=', editId))
      .andThen(jobRow => this.validateJob(jobRow))
  }

  private validateJob (jobRow: EditJobRow) {
    if (jobRow.editType !== this.type) {
      return errAsync(
        new BackendError(
          'INVALID_JOB_TYPE',
          `Expected job type ${this.type} but got ${jobRow.editType}`,
          400
        )
      )
    }

    if (jobRow.status !== JobStatus.QUEUED) {
      return errAsync(
        new BackendError(
          'INVALID_JOB_STATUS',
          'Only edits with queued status can be processed',
          400
        )
      )
    }

    return okAsync(jobRow)
  }

  private markJobProcessing (jobId: string) {
    const { services } = this.context
    const { editJobs } = services

    return editJobs
      .updateOne(
        eb => eb('id', '=', jobId),
        {
          status: JobStatus.PROCESSING
        }
      )
  }

  private markJobSuccess (jobId: string) {
    const { services } = this.context
    const { editJobs } = services

    return editJobs
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
    const { editJobs } = services

    return editJobs
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
    const reviser = new Ctor(trx.sources)
    return reviser
  }
}