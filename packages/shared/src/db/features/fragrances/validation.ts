import { VALID_IMAGE_TYPES } from '@src/db/validation.js'
import z from 'zod'

export const MIN_FRAGRANCE_NAME_LENGTH = 1
export const MAX_FRAGRANCE_NAME_LENGTH = 100
export const MAX_FRAGRANCE_DESCRIPTION_LENGTH = 3000
export const MAX_FRAGRANCE_IMAGE_SIZE = 5_000_000 // 5 MB

export const ValidFragranceName = z
  .string()
  .trim()
  .min(MIN_FRAGRANCE_NAME_LENGTH, 'Fragrance name must not be empty')
  .max(MAX_FRAGRANCE_NAME_LENGTH, 'Fragrance name cannot exceed 100 characters')

export const ValidFragranceDescription = z
  .string()
  .trim()
  .max(MAX_FRAGRANCE_DESCRIPTION_LENGTH, 'Fragrance description cannot exceed 3000 characters')
  .nullish()

export const ValidFragranceReleaseYear = z
  .number()
  .int()
  .min(1800, 'Release year must be after 1900')
  .max(new Date().getFullYear() + 1, 'Release year cannot be in the future')
  .nullish()

export const ValidFragranceImageType = z
  .enum(VALID_IMAGE_TYPES, 'Image must be a JPEG, PNG, or WEBP')

export const ValidFragranceImageSize = z
  .number()
  .int()
  .max(MAX_FRAGRANCE_IMAGE_SIZE, 'Image size cannot exceed 5 MB')

export const ValidFragrance = z
  .object({
    name: ValidFragranceName,
    description: ValidFragranceDescription,
    releaseYear: ValidFragranceReleaseYear
  })
  .strip()
