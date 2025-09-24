import { ValidEditReason, ValidNoteDescription, ValidNoteThumbnailSize, ValidNoteThumbnailType, ValidNoteName } from '@aromi/shared'
import z from 'zod'

export const CreateNoteEditSchema = z
  .object({
    noteId: z
      .uuid('Note ID must be a valid UUID')
      .nonoptional('Note ID is required'),
    proposedName: ValidNoteName.nullish(),
    proposedDescription: ValidNoteDescription.nullish(),
    reason: ValidEditReason.nullish()
  })
  .strip()

export const StageNoteEditThumbnailSchema = z
  .object({
    contentType: ValidNoteThumbnailType,
    contentSize: ValidNoteThumbnailSize
  })
  .strip()

export const CreateNoteRequestSchema = z
  .object({
    name: ValidNoteName.nullish(),
    description: ValidNoteDescription.nullish()
  })
  .strip()

export const UpdateNoteRequestSchema = z
  .object({
    name: ValidNoteName.nullish(),
    description: ValidNoteDescription.nullish(),
    assetId: z.uuid('Asset ID must be a valid UUID').nullish()
  })
  .strip()

export const StageNoteRequestThumbnailSchema = z
  .object({
    contentType: ValidNoteThumbnailType,
    contentSize: ValidNoteThumbnailSize
  })
  .strip()
