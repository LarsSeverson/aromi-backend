import { type AssetUploadRow, BackendError, type BrandRequestRow, type BrandRow, type DataSources, INDEXATION_JOB_NAMES, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, RequestType, unwrapOrThrow, ValidBrand } from '@aromi/shared'
import { BasePromoter } from './BasePromoter.js'
import type { Job } from 'bullmq'
import { err, errAsync, ok } from 'neverthrow'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_BRAND

export class BrandPromoter extends BasePromoter<PromotionJobPayload[JobKey], BrandRow> {
  constructor (sources: DataSources) {
    super({ sources, type: RequestType.BRAND })
  }

  async promote (job: Job<PromotionJobPayload[JobKey]>) {
    const { requestId } = job.data

    const brand = await this.withTransactionAsync(
      async promoter => await promoter.handlePromote(requestId)
    )

    await this.queueIndex(brand.id)

    return brand
  }

  private async handlePromote (requestId: string) {
    const request = await unwrapOrThrow(this.updateRequest(requestId))
    const avatar = await unwrapOrThrow(this.getAvatar(request))

    const brand = await unwrapOrThrow(this.createBrand(request))
    await unwrapOrThrow(this.createThumbnail(avatar, brand))

    return brand
  }

  private queueIndex (brandId: string) {
    const { context } = this
    const { queues } = context

    return queues
      .indexation
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_BRAND,
        data: { brandId }
      })
  }

  private updateRequest (requestId: string) {
    const { services } = this.context
    const { brands } = services

    return brands
      .requests
      .updateOne(
        eb => eb('id', '=', requestId),
        { requestStatus: RequestStatus.ACCEPTED }
      )
  }

  private createBrand (row: BrandRequestRow) {
    const { services } = this.context
    const { brands } = services

    const validRow = this.validateRequest(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    return brands.createOne(validRow.value)
  }

  private createThumbnail (
    asset: AssetUploadRow,
    brand: BrandRow
  ) {
    const { services } = this.context
    const { brands } = services

    const { id: brandId } = brand
    const { s3Key, name, contentType, sizeBytes } = asset

    return brands
      .images
      .createOne({
        brandId,
        s3Key,
        name,
        contentType,
        sizeBytes
      })
  }

  private getAvatar (request: BrandRequestRow) {
    const { services } = this.context
    const { assets } = services

    return assets
      .uploads
      .findOne(
        eb => eb('id', '=', request.assetId)
      )
      .mapErr(error => {
        if (error.status === 404) {
          return new BackendError(
            'ASSET_NOT_FOUND',
            'The request avatar was not found. This is required to promote a brand.',
            400
          )
        }

        return error
      })
  }

  private validateRequest (request: BrandRequestRow) {
    const { data, success, error } = ValidBrand.safeParse(request)

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
