import { type BackendError, JobStatus, unwrapOrThrow, unwrapOrThrowSync, type DataSources, type EditType, type RevisionJobData } from '@aromi/shared'
import type { JobContext } from '@src/jobs/JobContext.js'
import { JobHandler } from '@src/jobs/JobHandler.js'
import type { Job } from 'bullmq'
import { ResultAsync } from 'neverthrow'

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
    return ResultAsync.fromPromise(
      this.handleRevise(job),
      error => error as BackendError
    )
  }

  async handleRevise (job: Job<I>): Promise<O> {
    const { editId } = job.data

    const jobRow = await unwrapOrThrow(this.startJob(editId))

    const result = await ResultAsync.fromPromise(
      this.revise(job),
      error => error as BackendError
    )

    const error = result.isErr() ? result.error : undefined
    await unwrapOrThrow(this.endJob(jobRow.id, error))

    return unwrapOrThrowSync(result)
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
    const { services } = this.context
    const { editJobs } = services

    return editJobs.createOne({
      editId,
      editType: this.type,
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