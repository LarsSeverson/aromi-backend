import { ValidNoteDescription, ValidNoteImageSize, ValidNoteImageType, ValidNoteName, ValidVersion } from '@src/db'
import z from 'zod'

export const CreateNoteRequestSchema = z
  .object({
    name: ValidNoteName.nullish(),
    description: ValidNoteDescription
  })
  .strip()

export const UpdateNoteRequestSchema = z
  .object({
    version: ValidVersion,
    name: ValidNoteName.nullish(),
    description: ValidNoteDescription
  })
  .strip()

export const StageNoteRequestImageSchema = z
  .object({
    contentType: ValidNoteImageType,
    contentSize: ValidNoteImageSize
  })
  .strip()

export const FinalizeNoteRequestImageSchema = z
  .object({
    version: ValidVersion
  })
  .strip()
