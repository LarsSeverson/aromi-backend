import z from 'zod'

export const MIN_FRAGRANCE_NAME_LENGTH = 1
export const MAX_FRAGRANCE_NAME_LENGTH = 100

export const ValidName = z
  .string()
  .trim()
  .min(MIN_FRAGRANCE_NAME_LENGTH, 'Name must not be empty')
  .max(MAX_FRAGRANCE_NAME_LENGTH, 'Name cannot exceed 100 characters')
  .nullish()

export const MAX_FRAGRANCE_DESCRIPTION_LENGTH = 3000

export const ValidDescription = z
  .string()
  .trim()
  .max(MAX_FRAGRANCE_DESCRIPTION_LENGTH, 'Description cannot exceed 3000 characters')
  .nullish()

export const MIN_FRAGRANCE_RELEASE_YEAR = 1800
export const MAX_FRAGRANCE_RELEASE_YEAR = new Date().getFullYear()

export const ValidReleaseYear = z
  .number()
  .int()
  .min(MIN_FRAGRANCE_RELEASE_YEAR, 'Release year must be greater than 1799')
  .max(MAX_FRAGRANCE_RELEASE_YEAR, 'Release year must not be greater than the current year')
  .nullish()

export const ValidVersion = z
  .number()
  .int()
  .nonnegative()

export const CreateFragranceDraftSchema = z
  .object({
    name: ValidName,
    description: ValidDescription,
    releaseYear: ValidReleaseYear
  })
  .strip()

export const UpdateFragranceDraftSchema = z
  .object({
    version: ValidVersion,
    name: ValidName,
    description: ValidDescription,
    releaseYear: ValidReleaseYear
  })
  .strip()
