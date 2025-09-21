import type { RequestStatus, UpdateNoteRequestInput } from '@src/graphql/gql-types.js'
import type { INoteRequestSummary } from '../types.js'
import type { NoteRequestRow } from '@aromi/shared'
import { parseOrThrow, removeNullish } from '@aromi/shared'
import { UpdateNoteRequestSchema } from './validation.js'

export const mapUpdateNoteRequestInputToRow = (
  input: UpdateNoteRequestInput
): Partial<NoteRequestRow> => {
  const parsed = parseOrThrow(UpdateNoteRequestSchema, input)
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
