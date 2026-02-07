import { err, ok, ResultAsync } from 'neverthrow'
import sharp from 'sharp'
import { Vibrant } from 'node-vibrant/node'
import { BackendError, type DataSources, type FragranceImageRow, type FragranceRequestRow, type FragranceRow, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, RequestType, unwrapOrThrow, unwrapOrThrowSync, ValidFragrance } from '@aromi/shared'
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
      async promoter => await promoter.promoteRequest(requestId)
    )

    await this.enqueueIndex(fragrance.id)
    await this.processImage(image)

    return fragrance
  }

  private async promoteRequest (requestId: string) {
    const request = await unwrapOrThrow(this.getRequest(requestId))
    unwrapOrThrowSync(this.validateRequest(request))

    await unwrapOrThrow(this.updateRequest(requestId))
    const fragrance = await unwrapOrThrow(this.migrateRequest(request))

    const combined = await Promise.all([
      this.migrateImage(request, fragrance),
      this.migrateAccords(request, fragrance),
      this.migrateNotes(request, fragrance)
    ])

    const [image, accords, notes] = combined

    return { fragrance, image, accords, notes }
  }

  private enqueueIndex (fragranceId: string) {
    const { context } = this
    const { queues } = context

    return queues
      .indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        data: { fragranceId }
      })
  }

  private getRequest (requestId: string) {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .requests
      .findOne(eb => eb('id', '=', requestId))
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

  private migrateRequest (row: FragranceRequestRow): ResultAsync<FragranceRow, BackendError> {
    const { services } = this.context
    const { fragrances } = services

    const values = unwrapOrThrowSync(this.validateMigration(row))

    return fragrances.createOne(values)
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

    const voteValues = accords.map(({ accordId }) => ({ fragranceId, accordId, userId }))

    const votes = await unwrapOrThrow(
      fragrances
        .accords
        .votes
        .create(voteValues)
    )

    const scoreValues = accords.map(({ accordId }) => ({ fragranceId, accordId, upvotes: 1 }))

    await unwrapOrThrow(
      fragrances
        .accords
        .scores
        .create(scoreValues)
    )

    return votes
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

    const voteValues = notes.map(({ noteId, layer }) => ({ fragranceId, userId, noteId, layer }))

    const votes = await unwrapOrThrow(
      fragrances
        .notes
        .votes
        .create(voteValues)
    )

    const scoreValues = notes.map(({ noteId, layer }) => ({ fragranceId, noteId, layer, upvotes: 1 }))

    await unwrapOrThrow(
      fragrances
        .notes
        .scores
        .create(scoreValues)
    )

    return votes
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

  private validateRequest (row: FragranceRequestRow) {
    if (row.requestStatus !== RequestStatus.PENDING) {
      return err(
        new BackendError(
          'INVALID_REQUEST_STATUS',
          'Only requests with status PENDING can be promoted.',
          400
        )
      )
    }

    return ok(row)
  }

  private validateMigration (row: FragranceRequestRow) {
    const input = { ...row, status: row.fragranceStatus }
    const { data, success, error } = ValidFragrance.safeParse(input)
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
