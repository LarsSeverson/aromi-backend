import { ValidBrandDescription, ValidBrandAvatarSize, ValidBrandAvatarType, ValidBrandName, ValidBrandWebsite, ValidEditReason, ValidVote } from '@aromi/shared'
import z from 'zod'

export const CreateBrandEditSchema = z
  .object({
    brandId: z
      .uuid('Brand ID must be a valid UUID')
      .nonoptional('Brand ID is required'),
    proposedName: ValidBrandName.nullish(),
    proposedDescription: ValidBrandDescription.nullish(),
    proposedWebsite: ValidBrandWebsite.nullish(),
    reason: ValidEditReason.nullish()
  })
  .strip()

export const StageBrandEditAvatarSchema = z
  .object({
    contentType: ValidBrandAvatarType,
    contentSize: ValidBrandAvatarSize
  })
  .strip()

export const CreateBrandRequestSchema = z
  .object({
    name: ValidBrandName.nullish(),
    description: ValidBrandDescription.nullish(),
    website: ValidBrandWebsite.nullish()
  })
  .strip()

export const UpdateBrandRequestSchema = z
  .object({
    name: ValidBrandName.nullish(),
    description: ValidBrandDescription.nullish(),
    website: ValidBrandWebsite.nullish(),
    assetId: z.uuid('Asset ID must be a valid UUID').nullish()
  })
  .strip()

export const StageBrandRequestAvatarSchema = z
  .object({
    contentType: ValidBrandAvatarType,
    contentSize: ValidBrandAvatarSize
  })
  .strip()

export const VoteOnBrandInputSchema = z
  .object({
    vote: ValidVote
  })
  .strip()