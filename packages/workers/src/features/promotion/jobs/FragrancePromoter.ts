import { err, errAsync, ok, ResultAsync } from 'neverthrow'
import sharp from 'sharp'
import { Vibrant } from 'node-vibrant/node'
import { BackendError, type DataSources, type FragranceImageRow, type FragranceRequestRow, type FragranceRow, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, RequestType, unwrapOrThrow, ValidFragrance } from '@aromi/shared'
import { BasePromoter } from './BasePromoter.js'
import type { Job } from 'bullmq'
import { INDEXATION_JOB_NAMES } from '@aromi/shared'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE

export class FragrancePromoter extends BasePromoter<PromotionJobPayload[JobKey], FragranceRow> {
  constructor (sources: DataSources) {
    super({ sources, type: RequestType.FRAGRANCE })
  }

  async promote (job: Job<PromotionJobPayload[JobKey]>) {
    const { requestId } = job.data

    const { fragrance, image } = await this.withTransactionAsync(
      async promoter => await promoter.handlePromote(requestId)
    )

    await this.queueIndex(fragrance.id)
    await this.processImage(image)

    return fragrance
  }

  private async handlePromote (requestId: string) {
    const request = await unwrapOrThrow(this.updateRequest(requestId))
    const fragrance = await unwrapOrThrow(this.migrateFragrance(request))

    const combined = await Promise.all([
      this.migrateImage(request, fragrance),
      this.migrateAccords(request, fragrance),
      this.migrateNotes(request, fragrance),
      this.migrateTraits(request, fragrance)
    ])

    const [image, accords, notes, traits] = combined

    return { fragrance, image, accords, notes, traits }
  }

  private queueIndex (fragranceId: string) {
    const { context } = this
    const { queues } = context

    return queues
      .indexation
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        data: { fragranceId }
      })
  }

  private updateRequest (id: string): ResultAsync<FragranceRequestRow, BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .requests
      .updateOne(
        eb => eb('id', '=', id),
        { requestStatus: RequestStatus.ACCEPTED }
      )
  }

  private migrateFragrance (
    row: FragranceRequestRow
  ): ResultAsync<FragranceRow, BackendError> {
    const validRow = this.validateRow(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    const { services } = this.context
    const { fragrances } = services

    return fragrances.createOne(validRow.value)
  }

  private async migrateImage (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ) {
    const { services } = this.context
    const { fragrances } = services

    const { id: fragranceId } = fragrance

    const image = await unwrapOrThrow(this.getImage(request))

    const values = {
      fragranceId,
      s3Key: image.s3Key,
      name: image.name,
      contentType: image.contentType,
      sizeBytes: image.sizeBytes
    }

    return await unwrapOrThrow(
      fragrances
        .images
        .createOne(values)
    )
  }

  private async migrateAccords (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ) {
    const { services } = this.context
    const { fragrances } = services

    const { userId } = request
    const { id: fragranceId } = fragrance

    const accords = await unwrapOrThrow(this.getAccords(request))
    if (accords.length === 0) return []

    const values = accords
      .map(({ accordId }) => ({ fragranceId, accordId, userId }))

    return await unwrapOrThrow(
      fragrances
        .accords
        .votes
        .create(values)
    )
  }

  private async migrateNotes (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ) {
    const { services } = this.context
    const { fragrances } = services

    const { userId } = request
    const { id: fragranceId } = fragrance

    const notes = await unwrapOrThrow(this.getNotes(request))
    if (notes.length === 0) return []

    const values = notes.map(
      ({ noteId, layer }) => ({ fragranceId, userId, noteId, layer })
    )

    return await unwrapOrThrow(
      fragrances
        .notes
        .votes
        .create(values)
    )
  }

  private async migrateTraits (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ) {
    const { services } = this.context
    const { fragrances } = services

    const { userId } = request
    const { id: fragranceId } = fragrance

    const traits = await unwrapOrThrow(this.getTraits(request))
    if (traits.length === 0) return []

    const values = traits.map(
      ({ traitTypeId, traitOptionId }) => ({ fragranceId, userId, traitTypeId, traitOptionId })
    )

    return await unwrapOrThrow(
      fragrances
        .traitVotes
        .create(values)
    )
  }

  private getImage (request: FragranceRequestRow) {
    const { services } = this.context
    const { assets } = services

    return assets
      .uploads
      .findOne(
        eb => eb('id', '=', request.assetId)
      )
  }

  private getAccords (request: FragranceRequestRow) {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .requests
      .accords
      .find(
        eb => eb('requestId', '=', request.id)
      )
  }

  private getNotes (request: FragranceRequestRow) {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .requests
      .notes
      .find(
        eb => eb('requestId', '=', request.id)
      )
  }

  private getTraits (request: FragranceRequestRow) {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .requests
      .traits
      .find(
        eb => eb('requestId', '=', request.id)
      )
  }

  private validateRow (row: FragranceRequestRow) {
    const { data, success, error } = ValidFragrance.safeParse(row)
    if (!success) {
      return err(
        new BackendError(
          'INVALID_REQUEST_DATA',
          `The fragrance request data is invalid: ${error.message}`,
          400
        )
      )
    }

    return ok(data)
  }

  private async processImage (image: FragranceImageRow) {
    const { services } = this.context
    const { assets, fragrances } = services

    const buffer = await unwrapOrThrow(assets.getFromS3(image.s3Key))

    const { width, height }= await this.getMetadata(buffer).unwrapOr({ width: 0, height: 0 })
    const primaryColor = await this.getPrimaryColor(buffer).unwrapOr('#FFFFFF')

    const updated = await unwrapOrThrow(
      fragrances
        .images
        .updateOne(
          eb => eb('id', '=', image.id),
          {
            width,
            height,
            primaryColor,
            updatedAt: new Date().toISOString()
          }
        )
    )

    return updated
  }

  private getMetadata (buffer: Buffer) {
    return ResultAsync
      .fromPromise(
        sharp(buffer).metadata(),
        error => BackendError.fromSharp(error)
      )
  }

  private getPrimaryColor (buffer: Buffer) {
    return ResultAsync
      .fromPromise(
        Vibrant
          .from(buffer)
          .getPalette(),
        error => BackendError.fromVibrant(error)
      )
      .map(palette => palette.Vibrant?.hex ?? '#FFFFFF')
  }
}
