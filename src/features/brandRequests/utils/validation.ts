import z from 'zod'

export const MIN_BRAND_NAME_LENGTH = 1
export const MAX_BRAND_NAME_LENGTH = 100

export const ValidName = z
  .string()
  .trim()
  .min(MIN_BRAND_NAME_LENGTH, 'Name must not be empty')
  .max(MAX_BRAND_NAME_LENGTH, 'Name cannot exceed 100 characters')
  .nullish()

export const MAX_BRAND_DESCRIPTION_LENGTH = 3000

export const ValidDescription = z
  .string()
  .trim()
  .max(MAX_BRAND_DESCRIPTION_LENGTH, 'Description cannot exceed 3000 characters')
  .nullish()

export const ValidWebsite = z
  .url('Website must be a valid URL')
  .max(2000, 'Website cannot exceed 2000 characters')
  .nullish()

export const ValidVersion = z
  .number()
  .int()
  .nonnegative()

export const CreateBrandRequestSchema = z
  .object({
    name: ValidName,
    description: ValidDescription,
    website: ValidWebsite
  })
  .strip()

export const UpdateBrandRequestSchema = z
  .object({
    version: ValidVersion,
    name: ValidName,
    description: ValidDescription,
    website: ValidWebsite
  })
  .strip()

export const VALID_BRAND_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
]

export const MAX_BRAND_IMAGE_SIZE = 2_000_000 // 2 MB

export const StageBrandRequestImageSchema = z
  .object({
    contentType: z
      .enum(VALID_BRAND_IMAGE_TYPES, 'Image must be a JPEG, PNG, or WEBP'),
    contentSize: z
      .number()
      .int()
      .max(MAX_BRAND_IMAGE_SIZE, 'Image size cannot exceed 2 MB')
  })
  .strip()

export const FinalizeBrandRequestImageSchema = z
  .object({
    version: ValidVersion
  })
  .strip()
