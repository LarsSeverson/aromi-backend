import { err, errAsync, ok, okAsync, ResultAsync, type Result } from 'neverthrow'
import type z from 'zod'
import sharp from 'sharp'
import { Vibrant } from 'node-vibrant/node'
import { AssetStatus, BackendError, type FragranceAccordVoteRow, type FragranceImageRow, type FragranceNoteVoteRow, type FragranceRequestRow, type FragranceRow, type FragranceTraitVoteRow, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, ValidFragrance } from '@aromi/shared'
import { BasePromoter } from './BasePromoter.js'
import type { Job } from 'bullmq'
import { SEARCH_SYNC_JOB_NAMES } from '@aromi/shared'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE

export class FragrancePromoter extends BasePromoter<PromotionJobPayload[JobKey], FragranceRow> {
  promote (job: Job<PromotionJobPayload[JobKey]>): ResultAsync<FragranceRow, BackendError> {
    const { queues } = this.context

    const { requestId } = job.data

    return this
      .withTransaction(trxPromoter => trxPromoter
        .updateRequest(requestId)
        .andThen(row => trxPromoter
          .promoteFragrance(row)
          .andThen(fragrance => ResultAsync
            .combine([
              trxPromoter.promoteImage(row, fragrance),
              trxPromoter.promoteAccords(row, fragrance),
              trxPromoter.promoteNotes(row, fragrance),
              trxPromoter.promoteTraits(row, fragrance)
            ])
            .map(([image, accords, notes, traits]) => ({ fragrance, image, accords, notes, traits }))
          )
          .orTee(error => this.markFailed(row, error))
        )
      )
      .andTee(({ fragrance }) => queues
        .searchSync
        .enqueue({
          jobName: SEARCH_SYNC_JOB_NAMES.SYNC_FRAGRANCE,
          data: { fragranceId: fragrance.id }
        })
      )
      .andThrough(({ image }) => this
        .processImage(image)
        .orElse(() => okAsync(image))
      )
      .map(({ fragrance }) => fragrance)
  }

  private updateRequest (id: string): ResultAsync<FragranceRequestRow, BackendError> {
    const { services } = this.context
    const { fragranceRequests } = services

    return fragranceRequests
      .updateOne(
        eb => eb('id', '=', id),
        { requestStatus: RequestStatus.ACCEPTED }
      )
  }

  private promoteFragrance (
    row: FragranceRequestRow
  ): ResultAsync<FragranceRow, BackendError> {
    const validRow = this.validateRow(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    const { services } = this.context
    const { fragrances } = services

    return fragrances.createOne(validRow.value)
  }

  private promoteImage (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ): ResultAsync<FragranceImageRow, BackendError> {
    const { services } = this.context
    const { fragrances, fragranceRequests } = services

    const { id: fragranceId } = fragrance

    return fragranceRequests
      .images
      .findOne(
        eb => eb.and([
          eb('requestId', '=', request.id),
          eb('status', '=', AssetStatus.READY)
        ])
      )
      .andThen(image => {
        const { s3Key, name, contentType, sizeBytes } = image

        return fragrances
          .images
          .createOne({
            fragranceId,
            s3Key,
            name,
            contentType,
            sizeBytes
          })
      })
  }

  private promoteAccords (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ): ResultAsync<FragranceAccordVoteRow[], BackendError> {
    const { services } = this.context
    const { fragrances, fragranceRequests } = services

    const { id: requestId, userId } = request
    const { id: fragranceId } = fragrance

    return fragranceRequests
      .accords
      .find(
        eb => eb('requestId', '=', requestId)
      )
      .andThen(accords => {
        if (accords.length === 0) {
          return okAsync([])
        }

        const values = accords
          .map(({ accordId }) => ({ fragranceId, accordId, userId }))

        return fragrances
          .accords
          .votes
          .create(values)
      })
  }

  private promoteNotes (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ): ResultAsync<FragranceNoteVoteRow[], BackendError> {
    const { services } = this.context
    const { fragrances, fragranceRequests } = services

    const { id: requestId, userId } = request
    const { id: fragranceId } = fragrance

    return fragranceRequests
      .notes
      .find(
        eb => eb('requestId', '=', requestId)
      )
      .andThen(notes => {
        if (notes.length === 0) {
          return okAsync([])
        }

        const values = notes
          .map(({ noteId, layer }) => ({ fragranceId, userId, noteId, layer }))

        return fragrances
          .notes
          .votes
          .create(values)
      })
  }

  private promoteTraits (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ): ResultAsync<FragranceTraitVoteRow[], BackendError> {
    const { services } = this.context
    const { fragrances, fragranceRequests } = services

    const { userId } = request
    const { id: fragranceId } = fragrance

    return fragranceRequests
      .traits
      .find(
        eb => eb('requestId', '=', request.id)
      )
      .andThen(traits => {
        const values = traits
          .map(trait => {
            if (trait.traitOptionId == null) return null

            return {
              userId,
              fragranceId,
              traitTypeId: trait.traitTypeId,
              traitOptionId: trait.traitOptionId
            }
          })
          .filter(v => v != null)

        if (values.length === 0) {
          return okAsync([])
        }

        return fragrances
          .traitVotes
          .create(values)
      })
  }

  private processImage (
    imageRow: FragranceImageRow
  ): ResultAsync<FragranceImageRow, BackendError> {
    const { services } = this.context
    const { assets, fragrances } = services

    return assets
      .getFromS3(imageRow.s3Key)
      .andThen(buffer => ResultAsync
        .combine([
          this.getMetadata(buffer).orElse(() => okAsync(null)),
          this.getPrimaryColor(buffer).orElse(() => okAsync(null))
        ])
        .andThen(([metadata, primaryColor]) => {
          const { width = 0, height = 0 } = metadata ?? {}
          const bg = primaryColor ?? '#FFFFFF'

          return okAsync({ width, height, primaryColor: bg })
        })
      )
      .andThen(({ width, height, primaryColor }) => fragrances
        .images
        .updateOne(
          eb => eb('id', '=', imageRow.id),
          {
            width,
            height,
            primaryColor,
            updatedAt: new Date().toISOString()
          }
        )
      )
  }

  private validateRow (row: FragranceRequestRow): Result<z.output<typeof ValidFragrance>, BackendError> {
    const { data, success, error } = ValidFragrance.safeParse(row)
    if (!success) {
      return err(BackendError.fromZod(error))
    }

    return ok(data)
  }

  private markFailed (row: FragranceRequestRow, error: BackendError): ResultAsync<never, BackendError> {
    const { services } = this.context
    const { fragranceRequests } = services

    return fragranceRequests
      .updateOne(
        eb => eb('id', '=', row.id),
        {
          requestStatus: RequestStatus.FAILED,
          updatedAt: new Date().toISOString()
        }
      )
      .andThen(() => errAsync(error))
  }

  private getMetadata (
    imageBuffer: Buffer
  ): ResultAsync<sharp.Metadata, BackendError> {
    return ResultAsync
      .fromPromise(
        sharp(imageBuffer)
          .metadata(),
        error => BackendError.fromSharp(error)
      )
  }

  private getPrimaryColor (
    imageBuffer: Buffer
  ): ResultAsync<string, BackendError> {
    return ResultAsync
      .fromPromise(
        Vibrant
          .from(imageBuffer)
          .getPalette(),
        error => BackendError.fromVibrant(error)
      )
      .andThen(palette => {
        const hex = palette.Vibrant?.hex
        if (hex == null) {
          return errAsync(new BackendError('NoVibrantColor', 'Could not determine vibrant color from image', 500))
        }
        return okAsync(hex)
      })
  }
}
