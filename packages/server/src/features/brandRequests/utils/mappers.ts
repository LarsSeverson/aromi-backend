import type { UpdateBrandRequestInput, CreateBrandRequestInput, RequestStatus, BrandRequestImage } from '@src/graphql/gql-types.js'
import type { IBrandRequestSummary } from '../types.js'
import type { BrandRequestRow, BrandRequestImageRow } from '@aromi/shared'
import { parseOrThrow, removeNullish } from '@aromi/shared'
import { CreateBrandRequestSchema, UpdateBrandRequestSchema } from './validation.js'

export const mapCreateBrandRequestInputToRow = (
  input?: CreateBrandRequestInput | null
): Partial<BrandRequestRow> => {
  const parsed = parseOrThrow(CreateBrandRequestSchema, input ?? {})
  const cleaned = removeNullish(parsed)

  const output: Partial<BrandRequestRow> = cleaned

  return output
}

export const mapUpdateBrandRequestInputToRow = (
  input: UpdateBrandRequestInput
): Partial<BrandRequestRow> => {
  const { version, ...parsed } = parseOrThrow(UpdateBrandRequestSchema, input)
  const cleaned = removeNullish(parsed)

  const output: Partial<BrandRequestRow> = cleaned
  output.updatedAt = new Date().toISOString()

  return output
}

export const mapBrandRequestRowToBrandRequestSummary = (
  row: BrandRequestRow
): IBrandRequestSummary => {
  return {
    ...row,
    requestStatus: row.requestStatus as RequestStatus
  }
}

export const mapBrandRequestImageRowToBrandImage = (
  row: BrandRequestImageRow
): BrandRequestImage => {
  const { id, contentType } = row
  return { id, type: contentType, url: '' }
}
