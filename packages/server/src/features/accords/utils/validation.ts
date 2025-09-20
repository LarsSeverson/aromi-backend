import { ValidAccordColor, ValidAccordDescription, ValidAccordThumbnailSize, ValidAccordThumbnailType, ValidAccordName, ValidEditReason } from '@aromi/shared'
import z from 'zod'

export const CreateAccordEditSchema = z
  .object({
    accordId: z
      .uuid('Accord ID must be a valid UUID')
      .nonoptional('Accord ID is required'),
    proposedName: ValidAccordName.nullish(),
    proposedDescription: ValidAccordDescription.nullish(),
    proposedColor: ValidAccordColor.nullish(),
    reason: ValidEditReason.nullish()
  })
  .strip()

export const CreateAccordRequestSchema = z
  .object({
    name: ValidAccordName.nullish(),
    description: ValidAccordDescription.nullish(),
    color: ValidAccordColor.nullish()
  })
  .strip()

export const UpdateAccordRequestSchema = z
  .object({
    name: ValidAccordName.nullish(),
    description: ValidAccordDescription.nullish(),
    color: ValidAccordColor.nullish()
  })
  .strip()

export const StageAccordRequestThumbnailSchema = z
  .object({
    contentType: ValidAccordThumbnailType,
    contentSize: ValidAccordThumbnailSize
  })
  .strip()
