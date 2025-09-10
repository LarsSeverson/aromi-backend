import { err, errAsync, ok, type Result, type ResultAsync } from 'neverthrow'
import type z from 'zod'
import type { Job } from 'bullmq'
import { type AccordImageRow, type AccordRequestImageRow, type AccordRequestRow, type AccordRow, BackendError, type PROMOTION_JOB_NAMES, type PromotionJobPayload, ValidAccord } from '@aromi/shared'
import { BasePromoter } from './BasePromoter.js'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_ACCORD

export class AccordPromoter extends BasePromoter<PromotionJobPayload[JobKey], AccordRow> {
  promote (job: Job<PromotionJobPayload[JobKey]>): ResultAsync<AccordRow, BackendError> {
    const row = job.data

    return this
      .withTransaction(trxPromoter => trxPromoter
        .promoteAccord(row)
        .orTee(error => this.markFailed(row, error)))
  }

  private promoteAccord (row: AccordRequestRow): ResultAsync<AccordRow, BackendError> {
    const { services } = this.context
    const { accords } = services

    const validRow = this.validateRow(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    return accords
      .createOne(validRow.value)
      .andThrough(accord => this
        .promoteImage(row, accord))
  }

  private promoteImage (
    request: AccordRequestRow,
    accord: AccordRow
  ): ResultAsync<AccordImageRow, BackendError> {
    const { services } = this.context
    const { accords } = services

    return this
      .getImage(request)
      .andThen(image => {
        const { id: accordId } = accord
        const { s3Key, name, contentType, sizeBytes } = image

        return accords
          .images
          .createOne({
            accordId,
            s3Key,
            name,
            contentType,
            sizeBytes
          })
      })
  }

  private getImage (row: AccordRequestRow): ResultAsync<AccordRequestImageRow, BackendError> {
    const { services } = this.context
    const { accordRequests } = services

    return accordRequests
      .images
      .findOne(
        eb => eb.and([
          eb('requestId', '=', row.id),
          eb('status', '=', 'ready')
        ])
      )
  }

  private validateRow (row: AccordRequestRow): Result<z.output<typeof ValidAccord>, BackendError> {
    const { data, success, error } = ValidAccord.safeParse(row)
    if (!success) {
      return err(BackendError.fromZod(error))
    }

    return ok(data)
  }

  private markFailed (row: AccordRequestRow, error: BackendError): ResultAsync<never, BackendError> {
    const { services } = this.context
    const { accordRequests } = services

    return accordRequests
      .updateOne(
        eb => eb('id', '=', row.id),
        {
          requestStatus: 'FAILED',
          updatedAt: new Date().toISOString()
        }
      )
      .andThen(() => errAsync(error))
  }
}
