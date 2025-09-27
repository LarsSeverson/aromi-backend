import { ValidEditReason, ValidFragranceConcentration, ValidFragranceDescription, ValidFragranceImageSize, ValidFragranceImageType, ValidFragranceName, ValidFragranceReleaseYear, ValidFragranceStatus, ValidVote } from '@aromi/shared'
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
  .strip()

export const StageFragranceEditThumbnailSchema = z
  .object({
    contentType: ValidFragranceImageType,
    contentSize: ValidFragranceImageSize
  })
  .strip()

export const CreateFragranceRequestSchema = z
  .object({
    name: ValidFragranceName.nullish(),
    description: ValidFragranceDescription.nullish(),
    releaseYear: ValidFragranceReleaseYear.nullish(),
    assetId: z.uuid('Asset ID must be a valid UUID').nullish()
  })
  .strip()

export const UpdateFragranceRequestSchema = z
  .object({
    name: ValidFragranceName.nullish(),
    description: ValidFragranceDescription.nullish(),
    releaseYear: ValidFragranceReleaseYear.nullish(),
    assetId: z.uuid('Asset ID must be a valid UUID').nullish()
  })
  .strip()

export const StageFragranceRequestImageSchema = z
  .object({
    contentType: ValidFragranceImageType,
    contentSize: ValidFragranceImageSize
  })
  .strip()

export const VoteOnFragranceInputSchema = z
  .object({
    vote: ValidVote
  })
  .strip()