import { VALID_IMAGE_TYPES, ValidWebsite } from '@src/db/validation'
import z from 'zod'

export const MIN_BRAND_NAME_LENGTH = 1
export const MAX_BRAND_NAME_LENGTH = 100
export const MAX_BRAND_DESCRIPTION_LENGTH = 3000
export const MAX_BRAND_COLOR_LENGTH = 9
export const MAX_BRAND_IMAGE_SIZE = 2_000_000 // 2 MB

export const ValidBrandName = z
  .string()
  .trim()
  .min(MIN_BRAND_NAME_LENGTH, 'Brand name must not be empty')
  .max(MAX_BRAND_NAME_LENGTH, 'Brand name cannot exceed 100 characters')

export const ValidBrandDescription = z
  .string()
  .trim()
  .max(MAX_BRAND_DESCRIPTION_LENGTH, 'Brand description cannot exceed 3000 characters')
  .nullish()

export const ValidBrandWebsite = ValidWebsite.nullish()

export const ValidBrandImageType = z
  .enum(VALID_IMAGE_TYPES, 'Image must be a JPEG, PNG, or WEBP')

export const ValidBrandImageSize = z
  .number()
  .int()
  .max(MAX_BRAND_IMAGE_SIZE, 'Image size cannot exceed 2 MB')

export const ValidBrand = z
  .object({
    name: ValidBrandName,
    description: ValidBrandDescription,
    website: ValidBrandWebsite
  })
  .strip()
