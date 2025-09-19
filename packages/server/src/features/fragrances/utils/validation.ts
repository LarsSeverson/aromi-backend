import { ValidEditReason, ValidFragranceConcentration, ValidFragranceDescription, ValidFragranceImageSize, ValidFragranceImageType, ValidFragranceName, ValidFragranceReleaseYear, ValidFragranceStatus } from '@aromi/shared'
import z from 'zod'

export const CreateFragranceEditSchema = z
  .object({
    fragranceId: z
      .uuid('Fragrance ID must be a valid UUID')
      .nonoptional('Fragrance ID is required'),
    proposedName: ValidFragranceName.nullish(),
    proposedDescription: ValidFragranceDescription.nullish(),
    proposedReleaseYear: ValidFragranceReleaseYear.nullish(),
    proposedConcentration: ValidFragranceConcentration.nullish(),
    proposedStatus: ValidFragranceStatus.nullish(),
    reason: ValidEditReason.nullish()
  })

export const StageFragranceEditThumbnailSchema = z
  .object({
    contentType: ValidFragranceImageType,
    contentSize: ValidFragranceImageSize
  })