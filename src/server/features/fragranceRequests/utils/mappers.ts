import { parseSchema, removeNullish } from '@src/utils/validation'
import { CreateFragranceRequestSchema, UpdateFragranceRequestSchema } from '@src/server/features/fragranceRequests/utils/validation'
import type { IFragranceRequestSummary } from '@src/server/features/fragranceRequests/types'
import type { FragranceRequestImageRow, FragranceRequestRow } from '@src/db/features/fragranceRequests/types'
import { mapGQLStatusToDBStatus, mapGQLConcentrationToDBConcentration, mapDBStatusToGQLStatus, mapDBConcentrationToGQLConcentration } from '../../fragrances/utils/mappers'
import { type RequestStatus, type UpdateFragranceRequestInput, type CreateFragranceRequestInput, type FragranceRequestTrait, type TraitTypeEnum, type FragranceRequestImage } from '@generated/gql-types'
import { type CombinedTraitRow } from '@src/db/features/traits/types'

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
