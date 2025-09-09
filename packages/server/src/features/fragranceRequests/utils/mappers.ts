import { parseSchema, removeNullish } from '@aromi/shared'
import type { FragranceRequestImageRow, FragranceRequestRow, CombinedTraitRow } from '@aromi/shared'
import type { RequestStatus, UpdateFragranceRequestInput, CreateFragranceRequestInput, FragranceRequestTrait, TraitTypeEnum, FragranceRequestImage } from '@src/graphql/gql-types.js'
import { CreateFragranceRequestSchema, UpdateFragranceRequestSchema } from './validation.js'
import { mapDBConcentrationToGQLConcentration, mapDBStatusToGQLStatus, mapGQLConcentrationToDBConcentration, mapGQLStatusToDBStatus } from '@src/features/fragrances/utils/mappers.js'
import type { IFragranceRequestSummary } from '../types.js'

export const mapCreateFragranceRequestInputToRow = (
  input: CreateFragranceRequestInput
): Partial<FragranceRequestRow> => {
  const { status, concentration } = input
  const parsedInput = parseSchema(CreateFragranceRequestSchema, input)
  const cleanedInput = removeNullish(parsedInput)

  const output: Partial<FragranceRequestRow> = cleanedInput

  if (status != null) {
    output.fragranceStatus = mapGQLStatusToDBStatus(status)
  }

  if (concentration != null) {
    output.concentration = mapGQLConcentrationToDBConcentration(concentration)
  }

  return output
}

export const mapUpdateFragranceRequestInputToRow = (
  input: UpdateFragranceRequestInput
): Partial<FragranceRequestRow> => {
  const { status, concentration } = input
  const { version, ...parsedInput } = parseSchema(UpdateFragranceRequestSchema, input)
  const cleanedInput = removeNullish(parsedInput)

  const output: Partial<FragranceRequestRow> = cleanedInput
  output.updatedAt = new Date().toISOString()

  if (status != null) {
    output.fragranceStatus = mapGQLStatusToDBStatus(status)
  }

  if (concentration != null) {
    output.concentration = mapGQLConcentrationToDBConcentration(concentration)
  }

  return output
}

export const mapFragranceRequestRowToFragranceRequest = (
  row: FragranceRequestRow
): IFragranceRequestSummary => {
  const {
    brandId,
    requestStatus: dbRequestStatus,
    fragranceStatus: dbFragranceStatus,
    concentration: dbConcentration,
    ...rest
  } = row

  const mappedRequestStatus = dbRequestStatus as RequestStatus
  const mappedFragranceStatus = dbFragranceStatus != null ? mapDBStatusToGQLStatus(dbFragranceStatus) : null
  const mappedConcentration = dbConcentration != null ? mapDBConcentrationToGQLConcentration(dbConcentration) : null

  return {
    brandId,
    requestStatus: mappedRequestStatus,
    fragranceStatus: mappedFragranceStatus,
    concentration: mappedConcentration,
    ...rest
  }
}

export const mapFragranceRequesttImageRowToFragranceImage = (
  row: FragranceRequestImageRow
): FragranceRequestImage => {
  const { id, contentType } = row
  return { id, type: contentType, url: '' }
}

export const mapCombinedTraitRowToRequestTrait = (
  row: CombinedTraitRow
): FragranceRequestTrait => {
  const { traitType, traitOption } = row

  return {
    traitType: traitType.name.toUpperCase() as TraitTypeEnum,
    selectedOption: {
      id: traitOption.id,
      label: traitOption.label,
      score: traitOption.score
    }
  }
}
