import { ValidEditReason, ValidNoteDescription, ValidNoteImageSize, ValidNoteImageType, ValidNoteName } from '@aromi/shared'
import z from 'zod'

export const CreateNoteEditSchema = z
  .object({
    noteId: z
      .uuid('Note ID must be a valid UUID')
      .nonoptional('Note ID is required'),
    proposedName: ValidNoteName.nullish(),
    proposedDescription: ValidNoteDescription,
    reason: ValidEditReason.nullish()
  })

export const StageNoteEditThumbnailSchema = z
  .object({
    contentType: ValidNoteImageType,
    contentSize: ValidNoteImageSize
  })