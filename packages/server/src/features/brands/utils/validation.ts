import { ValidBrandDescription, ValidBrandImageSize, ValidBrandImageType, ValidBrandName, ValidBrandWebsite, ValidEditReason } from '@aromi/shared'
import z from 'zod'

export const CreateBrandEditSchema = z
  .object({
    brandId: z
      .uuid('Brand ID must be a valid UUID')
      .nonoptional('Brand ID is required'),
    proposedName: ValidBrandName.nullish(),
    proposedDescription: ValidBrandDescription,
    proposedWebsite: ValidBrandWebsite,
    reason: ValidEditReason.nullish()
  })

export const StageBrandEditAvatarSchema = z
  .object({
    contentType: ValidBrandImageType,
    contentSize: ValidBrandImageSize
  })