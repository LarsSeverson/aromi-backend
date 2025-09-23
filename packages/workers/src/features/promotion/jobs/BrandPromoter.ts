import { type AssetUploadRow, BackendError, type BrandRequestRow, type BrandRow, type DataSources, INDEXATION_JOB_NAMES, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, RequestType, unwrapOrThrow, unwrapOrThrowSync, ValidBrand } from '@aromi/shared'
import { BasePromoter } from './BasePromoter.js'
import type { Job } from 'bullmq'
import { err, ok } from 'neverthrow'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_BRAND

export class BrandPromoter extends BasePromoter<PromotionJobPayload[JobKey], BrandRow> {
  constructor (sources: DataSources) {
    super({ sources, type: RequestType.BRAND })
  }

  async promote (job: Job<PromotionJobPayload[JobKey]>) {
    const { requestId } = job.data

    const brand = await this.withTransactionAsync(
      async promoter => await promoter.promoteRequest(requestId)
    )

    await this.enqueueIndex(brand.id)

    return brand
  }

  private async promoteRequest (requestId: string) {
    const request = await unwrapOrThrow(this.getRequest(requestId))
    unwrapOrThrowSync(this.validateRequest(request))

    await unwrapOrThrow(this.updateRequest(requestId))
    const avatar = await unwrapOrThrow(this.getAvatar(request))

    const brand = await unwrapOrThrow(this.migrateRequest(request))
    await unwrapOrThrow(this.migrateThumbnail(avatar, brand))

    return brand
  }

  private enqueueIndex (brandId: string) {
    const { context } = this
    const { queues } = context

    return queues
      .indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_BRAND,
        data: { brandId }
      })
  }

  private getRequest (requestId: string) {
    const { services } = this.context
    const { brands } = services

    return brands
      .requests
      .findOne(eb => eb('id', '=', requestId))
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

  private migrateRequest (row: BrandRequestRow) {
    const { services } = this.context
    const { brands } = services

    const values = unwrapOrThrowSync(this.validateMigration(row))

    return brands.createOne(values)
  }

  private migrateThumbnail (
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
    const { requestStatus } = request

    if (requestStatus !== RequestStatus.PENDING) {
      return err(
        new BackendError(
          'INVALID_REQUEST_STATUS',
          'Only requests with status PENDING can be promoted.',
          400
        )
      )
    }

    return ok(request)
  }

  private validateMigration (request: BrandRequestRow) {
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
