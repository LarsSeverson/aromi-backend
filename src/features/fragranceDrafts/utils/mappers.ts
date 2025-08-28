import { parseSchema, removeNullish } from '@src/common/validation'
import { CreateFragranceDraftSchema, UpdateFragranceDraftSchema } from '@src/features/fragranceDrafts/resolvers/validation'
import type { DraftTraitResult, FragranceDraftImageRow, FragranceDraftRow, IFragranceDraftImageSummary, IFragranceDraftSummary } from '@src/features/fragranceDrafts/types'
import type { CreateFragranceDraftInput, FragranceDraftTrait, UpdateFragranceDraftInput } from '@src/generated/gql-types'
import { mapGQLStatusToDBStatus, mapGQLConcentrationToDBConcentration, mapDBStatusToGQLStatus, mapDBConcentrationToGQLConcentration } from '../../fragrances/utils/mappers'
import { DBTraitToGQLTrait } from '@src/features/traits/utils/mappers'

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
    fragranceStatus, concentration: dbConcentration, ...rest
  } = row

  const status = fragranceStatus != null ? mapDBStatusToGQLStatus(fragranceStatus) : null
  const concentration = dbConcentration != null ? mapDBConcentrationToGQLConcentration(dbConcentration) : null

  return { status, concentration, ...rest }
}

export const mapFragranceDraftImageRowToFragranceImage = (
  row: FragranceDraftImageRow
): IFragranceDraftImageSummary => {
  const { id, contentType } = row

  return { id, type: contentType, url: '' }
}

export const mapDraftTraitResultToDraftTrait = (
  result: DraftTraitResult
): FragranceDraftTrait => {
  const { traitTypeName, optionId, optionLabel, optionScore } = result

  const traitType = DBTraitToGQLTrait[traitTypeName]
  const selectedOption = (optionId != null && optionLabel != null && optionScore != null)
    ? { id: optionId, label: optionLabel, score: optionScore }
    : null

  return { traitType, selectedOption }
}
