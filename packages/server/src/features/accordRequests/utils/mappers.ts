import type { UpdateAccordRequestInput, CreateAccordRequestInput, AccordRequestImage, RequestStatus } from '@src/graphql/gql-types.js'
import type { IAccordRequestSummary } from '../types.js'
import { type AccordRequestRow, type AccordRequestImageRow, parseSchema, removeNullish } from '@aromi/shared'
import { CreateAccordRequestSchema, UpdateAccordRequestSchema } from './validation.js'

export const mapCreateAccordRequestInputToRow = (
  input: CreateAccordRequestInput
): Partial<AccordRequestRow> => {
  const parsed = parseSchema(CreateAccordRequestSchema, input)
  const cleaned = removeNullish(parsed)

  const output: Partial<AccordRequestRow> = cleaned

  return output
}

export const mapUpdateAccordRequestInputToRow = (
  input: UpdateAccordRequestInput
): Partial<AccordRequestRow> => {
  const { version, ...parsed } = parseSchema(UpdateAccordRequestSchema, input)
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

export const mapAccordRequestImageRowToAccordImage = (
  row: AccordRequestImageRow
): AccordRequestImage => {
  const { id, contentType } = row
  return { id, type: contentType, url: '' }
}
