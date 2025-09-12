import { err, errAsync, ok, okAsync, ResultAsync, type Result } from 'neverthrow'
import type z from 'zod'
import sharp from 'sharp'
import { Vibrant } from 'node-vibrant/node'
import { BackendError, type FragranceAccordRow, type FragranceImageRow, type FragranceNoteRow, type FragranceRequestRow, type FragranceRow, type FragranceTraitRow, type PROMOTION_JOB_NAMES, type PromotionJobPayload, ValidFragrance } from '@aromi/shared'
import { BasePromoter } from './BasePromoter.js'
import type { Job } from 'bullmq'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE

export class FragrancePromoter extends BasePromoter<PromotionJobPayload[JobKey], FragranceRow> {
  promote (job: Job<PromotionJobPayload[JobKey]>): ResultAsync<FragranceRow, BackendError> {
    const row = job.data

    return this
      .withTransaction(trxPromoter => trxPromoter
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
      .andThrough(({ image }) => this
        .processImage(image)
        .orElse(() => okAsync(image))
      )
      .map(({ fragrance }) => fragrance)
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
          eb('status', '=', 'ready')
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
  ): ResultAsync<FragranceAccordRow[], BackendError> {
    const { services } = this.context
    const { fragrances, fragranceRequests } = services

    const { id: fragranceId } = fragrance

    return fragranceRequests
      .accords
      .find(
        eb => eb('requestId', '=', request.id)
      )
      .andThen(accords => {
        if (accords.length === 0) {
          return okAsync([])
        }

        const values = accords
          .map(({ accordId }) => ({ fragranceId, accordId }))

        return fragrances
          .accords
          .create(values)
      })
  }

  private promoteNotes (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ): ResultAsync<FragranceNoteRow[], BackendError> {
    const { services } = this.context
    const { fragrances, fragranceRequests } = services

    const { id: fragranceId } = fragrance

    return fragranceRequests
      .notes
      .find(
        eb => eb('requestId', '=', request.id)
      )
      .andThen(notes => {
        if (notes.length === 0) {
          return okAsync([])
        }

        const values = notes
          .map(({ noteId, layer }) => ({ fragranceId, noteId, layer }))

        return fragrances
          .notes
          .create(values)
      })
  }

  private promoteTraits (
    request: FragranceRequestRow,
    fragrance: FragranceRow
  ): ResultAsync<FragranceTraitRow[], BackendError> {
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
        if (traits.length === 0) {
          return okAsync({ traits: [], fTraits: [] })
        }

        const values = traits.map(({ traitTypeId }) => ({ fragranceId, traitTypeId }))

        return fragrances
          .traits
          .create(values)
          .map(fTraits => ({ traits, fTraits }))
      })
      .andThrough(({ traits, fTraits }) => {
        const values = traits
          .map(trait => {
            const fTrait = fTraits.find(ft => ft.traitTypeId === trait.traitTypeId)
            if (fTrait == null || trait.traitOptionId == null) return null

            return {
              userId,
              fragranceTraitId: fTrait.id,
              traitOptionId: trait.traitOptionId
            }
          })
          .filter(v => v != null)

        if (values.length === 0) {
          return okAsync([])
        }

        return fragrances
          .traits
          .votes
          .create(values)
      })
      .map(({ fTraits }) => fTraits)
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
          requestStatus: 'FAILED',
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
