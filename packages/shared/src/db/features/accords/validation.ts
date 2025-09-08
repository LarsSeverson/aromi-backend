import { VALID_IMAGE_TYPES } from '@src/db/validation.js'
import z from 'zod'

export const MIN_ACCORD_NAME_LENGTH = 1
export const MAX_ACCORD_NAME_LENGTH = 100
export const MAX_ACCORD_DESCRIPTION_LENGTH = 3000
export const MAX_ACCORD_COLOR_LENGTH = 9
export const MAX_ACCORD_IMAGE_SIZE = 2_000_000 // 2 MB

export const ValidAccordName = z
  .string()
  .trim()
  .min(MIN_ACCORD_NAME_LENGTH, 'Accord name must not be empty')
  .max(MAX_ACCORD_NAME_LENGTH, 'Accord name cannot exceed 100 characters')

export const ValidAccordDescription = z
  .string()
  .trim()
  .max(MAX_ACCORD_DESCRIPTION_LENGTH, 'Accord description cannot exceed 3000 characters')
  .nullish()

export const ValidAccordColor = z
  .string()
  .trim()
  .max(MAX_ACCORD_COLOR_LENGTH, 'Accord color cannot exceed 9 characters')
  .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Color must be a valid hex code')

export const ValidAccordImageType = z
  .enum(VALID_IMAGE_TYPES, 'Image must be a JPEG, PNG, or WEBP')

export const ValidAccordImageSize = z
  .number()
  .int()
  .max(MAX_ACCORD_IMAGE_SIZE, 'Image size cannot exceed 2 MB')

export const ValidAccord = z
  .object({
    name: ValidAccordName,
    description: ValidAccordDescription,
    color: ValidAccordColor
  })
  .strip()
