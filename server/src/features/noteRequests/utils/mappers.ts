import { type RequestStatus, type CreateNoteRequestInput, type UpdateNoteRequestInput, type NoteRequestImage } from '@src/graphql/gql-types'
import { type INoteRequestSummary } from '../types'
import { type NoteRequestRow, type NoteRequestImageRow } from '@aromi/shared/db'
import { parseSchema, removeNullish } from '@aromi/shared/utils/validation'
import { CreateNoteRequestSchema, UpdateNoteRequestSchema } from './validation'

export const mapCreateNoteRequestInputToRow = (
  input: CreateNoteRequestInput
): Partial<NoteRequestRow> => {
  const parsed = parseSchema(CreateNoteRequestSchema, input)
  const cleaned = removeNullish(parsed)

  const output: Partial<NoteRequestRow> = cleaned

  return output
}

export const mapUpdateNoteRequestInputToRow = (
  input: UpdateNoteRequestInput
): Partial<NoteRequestRow> => {
  const { version, ...parsed } = parseSchema(UpdateNoteRequestSchema, input)
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
