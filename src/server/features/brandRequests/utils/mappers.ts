import { type UpdateBrandRequestInput, type CreateBrandRequestInput, type RequestStatus, type BrandRequestImage } from '@generated/gql-types'
import { type IBrandRequestSummary } from '../types'
import { type BrandRequestRow, type BrandRequestImageRow } from '@src/db'
import { parseSchema, removeNullish } from '@src/utils/validation'
import { CreateBrandRequestSchema, UpdateBrandRequestSchema } from './validation'

export const mapCreateBrandRequestInputToRow = (
  input: CreateBrandRequestInput
): Partial<BrandRequestRow> => {
  const parsed = parseSchema(CreateBrandRequestSchema, input)
  const cleaned = removeNullish(parsed)

  const output: Partial<BrandRequestRow> = cleaned

  return output
}

export const mapUpdateBrandRequestInputToRow = (
  input: UpdateBrandRequestInput
): Partial<BrandRequestRow> => {
  const { version, ...parsed } = parseSchema(UpdateBrandRequestSchema, input)
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
