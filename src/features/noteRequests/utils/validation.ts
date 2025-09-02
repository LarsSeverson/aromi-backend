import z from 'zod'

export const MIN_NOTE_NAME_LENGTH = 1
export const MAX_NOTE_NAME_LENGTH = 100

export const ValidName = z
  .string()
  .trim()
  .min(MIN_NOTE_NAME_LENGTH, 'Name must not be empty')
  .max(MAX_NOTE_NAME_LENGTH, 'Name cannot exceed 100 characters')
  .nullish()

export const MAX_NOTE_DESCRIPTION_LENGTH = 3000

export const ValidDescription = z
  .string()
  .trim()
  .max(MAX_NOTE_DESCRIPTION_LENGTH, 'Description cannot exceed 3000 characters')
  .nullish()

export const ValidVersion = z
  .number()
  .int()
  .nonnegative()

export const CreateNoteRequestSchema = z
  .object({
    name: ValidName,
    description: ValidDescription
  })
  .strip()

export const UpdateNoteRequestSchema = z
  .object({
    version: ValidVersion,
    name: ValidName,
    description: ValidDescription
  })
  .strip()

export const VALID_NOTE_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
]

export const MAX_NOTE_IMAGE_SIZE = 2_000_000 // 2 MB

export const StageNoteRequestImageSchema = z
  .object({
    contentType: z
      .enum(VALID_NOTE_IMAGE_TYPES, 'Image must be a JPEG, PNG, or WEBP'),
    contentSize: z
      .number()
      .int()
      .max(MAX_NOTE_IMAGE_SIZE, 'Image size cannot exceed 2 MB')
  })
  .strip()

export const FinalizeNoteRequestImageSchema = z
  .object({
    version: ValidVersion
  })
  .strip()
