import type { UpdateAccordRequestInput, CreateAccordRequestInput, RequestStatus } from '@src/graphql/gql-types.js'
import type { IAccordRequestSummary } from '@src/features/accords/types.js'
import { type AccordRequestRow, parseOrThrow, removeNullish } from '@aromi/shared'
import { CreateAccordRequestSchema, UpdateAccordRequestSchema } from './validation.js'

export const mapCreateAccordRequestInputToRow = (
  input?: CreateAccordRequestInput | null
): Partial<AccordRequestRow> => {
  const parsed = parseOrThrow(CreateAccordRequestSchema, input ?? {})
  const cleaned = removeNullish(parsed)

  const output: Partial<AccordRequestRow> = cleaned

  return output
}

export const mapUpdateAccordRequestInputToRow = (
  input: UpdateAccordRequestInput
): Partial<AccordRequestRow> => {
  const parsed = parseOrThrow(UpdateAccordRequestSchema, input)
  const cleaned = removeNullish(parsed)

  const output: Partial<AccordRequestRow> = cleaned
  output.updatedAt = new Date().toISOString()

  return output
}

export const mapAccordRequestRowToAccordRequestSummary = (
  row: AccordRequestRow
): IAccordRequestSummary => {
  return {
    ...row,
    requestStatus: row.requestStatus as RequestStatus
  }
}
