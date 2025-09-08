import { VALID_IMAGE_TYPES } from '@src/db/validation.js'
import z from 'zod'

export const MIN_NOTE_NAME_LENGTH = 1
export const MAX_NOTE_NAME_LENGTH = 100
export const MAX_NOTE_DESCRIPTION_LENGTH = 3000
export const MAX_NOTE_IMAGE_SIZE = 2_000_000 // 2 MB

export const ValidNoteName = z
  .string()
  .trim()
  .min(MIN_NOTE_NAME_LENGTH, 'Note name must not be empty')
  .max(MAX_NOTE_NAME_LENGTH, 'Note name cannot exceed 100 characters')

export const ValidNoteDescription = z
  .string()
  .trim()
  .max(MAX_NOTE_DESCRIPTION_LENGTH, 'Note description cannot exceed 3000 characters')
  .nullish()

export const ValidNoteImageType = z
  .enum(VALID_IMAGE_TYPES, 'Image must be a JPEG, PNG, or WEBP')

export const ValidNoteImageSize = z
  .number()
  .int()
  .max(MAX_NOTE_IMAGE_SIZE, 'Image size cannot exceed 2 MB')

export const ValidNote = z
  .object({
    name: ValidNoteName,
    description: ValidNoteDescription
  })
  .strip()
