import { AssetStatus, BackendError, type BrandImageRow, type BrandRequestImageRow, type BrandRequestRow, type BrandRow, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, ValidBrand } from '@aromi/shared'
import { err, errAsync, ok, type ResultAsync, type Result } from 'neverthrow'
import type z from 'zod'
import { BasePromoter } from './BasePromoter.js'
import type { Job } from 'bullmq'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_BRAND

export class BrandPromoter extends BasePromoter<PromotionJobPayload[JobKey], BrandRow> {
  promote (job: Job<PromotionJobPayload[JobKey]>): ResultAsync<BrandRow, BackendError> {
    const { search } = this.context.services
    const { requestId } = job.data

    return this
      .withTransaction(trxPromoter => trxPromoter
        .getBrandRequest(requestId)
        .andThen(row => trxPromoter
          .promoteBrand(row)
          .orTee(error => trxPromoter.markFailed(row, error))
        )
      )
      .andTee(brand => search
        .brands
        .addDocument(brand)
      )
  }

  private getBrandRequest (id: string): ResultAsync<BrandRequestRow, BackendError> {
    const { services } = this.context
    const { brandRequests } = services

    return brandRequests
      .findOne(
        eb => eb('id', '=', id)
      )
  }

  private promoteBrand (row: BrandRequestRow): ResultAsync<BrandRow, BackendError> {
    const { services } = this.context
    const { brands } = services

    const validRow = this.validateRow(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    return brands
      .createOne(validRow.value)
      .andThrough(brand => this
        .promoteImage(row, brand)
      )
  }

  private promoteImage (
    request: BrandRequestRow,
    brand: BrandRow
  ): ResultAsync<BrandImageRow, BackendError> {
    const { services } = this.context
    const { brands } = services

    return this
      .getImage(request)
      .andThen(image => {
        const { id: brandId } = brand
        const { s3Key, name, contentType, sizeBytes } = image

        return brands
          .images
          .createOne({
            brandId,
            s3Key,
            name,
            contentType,
            sizeBytes
          })
      })
  }

  private getImage (row: BrandRequestRow): ResultAsync<BrandRequestImageRow, BackendError> {
    const { services } = this.context
    const { brandRequests } = services

    return brandRequests
      .images
      .findOne(
        eb => eb.and([
          eb('requestId', '=', row.id),
          eb('status', '=', AssetStatus.READY)
        ])
      )
  }

  private validateRow (row: BrandRequestRow): Result<z.output<typeof ValidBrand>, BackendError> {
    const { data, success, error } = ValidBrand.safeParse(row)
    if (!success) {
      return err(BackendError.fromZod(error))
    }

    return ok(data)
  }

  private markFailed (row: BrandRequestRow, error: BackendError): ResultAsync<never, BackendError> {
    const { services } = this.context
    const { brandRequests } = services

    return brandRequests
      .updateOne(
        eb => eb('id', '=', row.id),
        {
          requestStatus: RequestStatus.FAILED,
          updatedAt: new Date().toISOString()
        }
      )
      .andThen(() => errAsync(error))
  }
}
