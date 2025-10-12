import { ValidEditReason, ValidFragranceCollectionName, ValidFragranceConcentration, ValidFragranceDescription, ValidFragranceImageSize, ValidFragranceImageType, ValidFragranceName, ValidFragranceReleaseYear, ValidFragranceReview, ValidFragranceStatus, ValidVote } from '@aromi/shared'
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

export const CreateCollectionInputSchema = z
  .object({
    name: ValidFragranceCollectionName
  })
  .strip()

export const MoveFragranceCollectionItemInputSchema = z
  .object({
    insertBefore: z
      .uuid('Insert before must be a valid UUID')
      .nullish(),
    rangeStart: z
      .uuid('Range start must be a valid UUID'),
    rangeLength: z
      .number('Range length must be a number')
      .min(1, 'Range length must be at least 1')
      .max(20, 'Range length must be at most 20')
      .default(1)
  })
  .refine(
    data => data.insertBefore !== data.rangeStart,
    'Insert before cannot be the same as range start'
  )
  .strip()

export const CreateFragranceReviewInputSchema = ValidFragranceReview