import z from 'zod'

export const MIN_ACCORD_NAME_LENGTH = 1
export const MAX_ACCORD_NAME_LENGTH = 100

export const ValidName = z
  .string()
  .trim()
  .min(MIN_ACCORD_NAME_LENGTH, 'Name must not be empty')
  .max(MAX_ACCORD_NAME_LENGTH, 'Name cannot exceed 100 characters')
  .nullish()

export const MAX_ACCORD_DESCRIPTION_LENGTH = 3000

export const ValidDescription = z
  .string()
  .trim()
  .max(MAX_ACCORD_DESCRIPTION_LENGTH, 'Description cannot exceed 3000 characters')
  .nullish()

export const MAX_ACCORD_COLOR_LENGTH = 9

export const ValidColor = z
  .string()
  .trim()
  .max(MAX_ACCORD_COLOR_LENGTH, 'Color cannot exceed 9 characters')
  .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Color must be a valid hex code')
  .nullish()

export const ValidVersion = z
  .number()
  .int()
  .nonnegative()

export const CreateAccordRequestSchema = z
  .object({
    name: ValidName,
    description: ValidDescription,
    color: ValidColor
  })
  .strip()

export const UpdateAccordRequestSchema = z
  .object({
    version: ValidVersion,
    name: ValidName,
    description: ValidDescription,
    color: ValidColor
  })
  .strip()

export const VALID_ACCORD_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
]

export const MAX_ACCORD_IMAGE_SIZE = 2_000_000 // 2 MB

export const StageAccordRequestImageSchema = z
  .object({
    contentType: z
      .enum(VALID_ACCORD_IMAGE_TYPES, 'Image must be a JPEG, PNG, or WEBP'),
    contentSize: z
      .number()
      .int()
      .max(MAX_ACCORD_IMAGE_SIZE, 'Image size cannot exceed 2 MB')
  })
  .strip()

export const FinalizeAccordRequestImageSchema = z
  .object({
    version: ValidVersion
  })
  .strip()
