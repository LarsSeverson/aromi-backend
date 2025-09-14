import type { RequestStatus, CreateNoteRequestInput, UpdateNoteRequestInput, NoteRequestImage } from '@src/graphql/gql-types.js'
import type { INoteRequestSummary } from '../types.js'
import type { NoteRequestRow, NoteRequestImageRow } from '@aromi/shared'
import { parseOrThrow, removeNullish } from '@aromi/shared'
import { CreateNoteRequestSchema, UpdateNoteRequestSchema } from './validation.js'

export const mapCreateNoteRequestInputToRow = (
  input: CreateNoteRequestInput
): Partial<NoteRequestRow> => {
  const parsed = parseOrThrow(CreateNoteRequestSchema, input)
  const cleaned = removeNullish(parsed)

  const output: Partial<NoteRequestRow> = cleaned

  return output
}

export const mapUpdateNoteRequestInputToRow = (
  input: UpdateNoteRequestInput
): Partial<NoteRequestRow> => {
  const { version, ...parsed } = parseOrThrow(UpdateNoteRequestSchema, input)
  const cleaned = removeNullish(parsed)

  const output: Partial<NoteRequestRow> = cleaned
  output.updatedAt = new Date().toISOString()

  return output
}

export const mapNoteRequestRowToNoteRequestSummary = (
  row: NoteRequestRow
): INoteRequestSummary => {
  return {
    ...row,
    requestStatus: row.requestStatus as RequestStatus
  }
}

export const mapNoteRequestImageRowToNoteImage = (
  row: NoteRequestImageRow
): NoteRequestImage => {
  const { id, contentType } = row
  return { id, type: contentType, url: '' }
}
