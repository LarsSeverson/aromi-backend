import { err, errAsync, ok } from 'neverthrow'
import type { Job } from 'bullmq'
import { type AccordRequestRow, type AccordRow, type AssetUploadRow, BackendError, type DataSources, INDEXATION_JOB_NAMES, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, RequestType, unwrapOrThrow, ValidAccord } from '@aromi/shared'
import { BasePromoter } from './BasePromoter.js'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_ACCORD

export class AccordPromoter extends BasePromoter<PromotionJobPayload[JobKey], AccordRow> {
  constructor (sources: DataSources) {
    super({ sources, type: RequestType.ACCORD })
  }

  async promote (job: Job<PromotionJobPayload[JobKey]>) {
    const { requestId } = job.data

    const accord = await this.withTransactionAsync(
      async promoter => await promoter.handlePromote(requestId)
    )

    await this.queueIndex(accord.id)

    return accord
  }

  private async handlePromote (requestId: string) {
    const request = await unwrapOrThrow(this.updateRequest(requestId))
    const thumbnail = await unwrapOrThrow(this.getThumbnail(request))

    const accord = await unwrapOrThrow(this.createAccord(request))
    await unwrapOrThrow(this.migrateThumbnail(thumbnail, accord))

    return accord
  }

  private queueIndex (accordId: string) {
    const { context } = this
    const { queues } = context

    return queues
      .indexation
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_ACCORD,
        data: { accordId }
      })
  }

  private updateRequest (requestId: string) {
    const { services } = this.context
    const { accords } = services

    return accords
      .requests
      .updateOne(
        eb => eb('id', '=', requestId),
        { requestStatus: RequestStatus.ACCEPTED }
      )
  }

  private createAccord (row: AccordRequestRow) {
    const { services } = this.context
    const { accords } = services

    const validRow = this.validateRequest(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    return accords.createOne(validRow.value)
  }

  private migrateThumbnail (
    asset: AssetUploadRow,
    accord: AccordRow
  ) {
    const { services } = this.context
    const { accords } = services

    const { id: accordId } = accord
    const { s3Key, name, contentType, sizeBytes } = asset

    return accords
      .images
      .createOne({
        accordId,
        s3Key,
        name,
        contentType,
        sizeBytes
      })
  }

  private getThumbnail (request: AccordRequestRow) {
    const { services } = this.context
    const { assets } = services

    return assets
      .uploads
      .findOne(eb => eb('id', '=', request.assetId))
      .mapErr(error => {
        if (error.status === 404) {
          return new BackendError(
            'ASSET_NOT_FOUND',
            'The request thumbnail was not found. This is required to promote an accord.',
            400
          )
        }

        return error
      })
  }

  private validateRequest (request: AccordRequestRow) {
    const { data, success, error } = ValidAccord.safeParse(request)

    if (!success) {
      return err(
        new BackendError(
          'INVALID_REQUEST_DATA',
          `The request did not pass validation: ${error.message}`,
          400,
          BackendError.fromZod(error)
        )
      )
    }

    return ok(data)
  }
}
