import { type FragranceStatus, type Concentration, type CreateFragranceDraftInput, type UpdateFragranceDraftInput } from '@src/generated/gql-types'
import { type IFragranceDraftSummary, type FragranceDraftRow } from '../types'
import { parseSchema, removeNullish } from '@src/common/validation'
import { CreateFragranceDraftSchema, UpdateFragranceDraftSchema } from '../resolvers/validation'

export const mapGQLConcentrationToDBConcentration = (
  concentration: Concentration
): string => {
  return concentration
}

export const mapDBConcentrationToGQLConcentration = (
  concentration: string
): Concentration => {
  return concentration as Concentration
}

export const mapGQLStatusToDBStatus = (
  status: FragranceStatus
): string => {
  return status
}

export const mapDBStatusToGQLStatus = (
  status: string
): FragranceStatus => {
  return status as FragranceStatus
}

export const mapCreateFragranceDraftInputToRow = (
  input: CreateFragranceDraftInput
): Partial<FragranceDraftRow> => {
  const { status, concentration } = input
  const parsedInput = parseSchema(CreateFragranceDraftSchema, input)
  const cleanedInput = removeNullish(parsedInput)

  const output: Partial<FragranceDraftRow> = cleanedInput

  if (status != null) {
    output.fragranceStatus = mapGQLStatusToDBStatus(status)
  }

  if (concentration != null) {
    output.concentration = mapGQLConcentrationToDBConcentration(concentration)
  }

  return output
}

export const mapUpdateFragranceDraftInputToRow = (
  input: UpdateFragranceDraftInput
): Partial<FragranceDraftRow> => {
  const { status, concentration } = input
  const { version, ...parsedInput } = parseSchema(UpdateFragranceDraftSchema, input)
  const cleanedInput = removeNullish(parsedInput)

  const output: Partial<FragranceDraftRow> = cleanedInput
  output.updatedAt = new Date().toISOString()

  if (status != null) {
    output.fragranceStatus = mapGQLStatusToDBStatus(status)
  }

  if (concentration != null) {
    output.concentration = mapGQLConcentrationToDBConcentration(concentration)
  }

  return output
}

export const mapFragranceDraftRowToFragranceDraft = (
  row: FragranceDraftRow
): IFragranceDraftSummary => {
  const {
    fragranceStatus,
    concentration: dbConcentration,
    ...rest
  } = row

  const status = fragranceStatus != null ? mapDBStatusToGQLStatus(fragranceStatus) : null
  const concentration = dbConcentration != null ? mapDBConcentrationToGQLConcentration(dbConcentration) : null

  return { status, concentration, ...rest }
}
