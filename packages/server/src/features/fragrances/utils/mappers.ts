import { type NoteLayerEnum, type FragranceStatus as DBFragranceStatus, type FragranceConcentration, type FragranceRow, type FragranceImageRow, parseOrThrow, removeNullish, type CombinedTraitRow, type FragranceRequestRow } from '@aromi/shared'
import type { FragranceStatus, Concentration, NoteLayer, FragranceImage, CreateFragranceRequestInput, FragranceRequestTrait, RequestStatus, TraitTypeEnum, UpdateFragranceRequestInput } from '@src/graphql/gql-types.js'
import { CreateFragranceRequestSchema, UpdateFragranceRequestSchema } from './validation.js'
import type { IFragranceRequestSummary, IFragranceSummary } from '../types.js'

export const mapGQLConcentrationToDBConcentration = (
  concentration: Concentration | null
): FragranceConcentration | null => {
  return concentration as FragranceConcentration | null
}

export const mapDBConcentrationToGQLConcentration = (
  concentration: FragranceConcentration
): Concentration => {
  return concentration as Concentration
}

export const mapGQLStatusToDBStatus = (
  status: FragranceStatus
): DBFragranceStatus => {
  return status as DBFragranceStatus
}

export const mapDBStatusToGQLStatus = (
  status: string
): FragranceStatus => {
  return status as FragranceStatus
}

export const mapGQLNoteLayerToDBNoteLayer = (
  layer: NoteLayer
): NoteLayerEnum => {
  return layer.toLowerCase() as NoteLayerEnum
}

export const mapDBNoteLayerToGQLNoteLayer = (
  layer: NoteLayerEnum
): NoteLayer => {
  return layer.toUpperCase() as NoteLayer
}

export const mapFragranceRowToFragranceSummary = (row: FragranceRow): IFragranceSummary => {
  const { id, brandId, name, description, concentration, status, releaseYear } = row

  return {
    id,
    brandId,
    name,
    description,
    concentration: mapDBConcentrationToGQLConcentration(concentration),
    status: mapDBStatusToGQLStatus(status),
    releaseYear: releaseYear ?? 1890
  }
}

export const mapFragranceImageRowToFragranceImage = (row: FragranceImageRow): FragranceImage => {
  const { id, primaryColor, width, height } = row
  return {
    id,
    width,
    height,
    primaryColor
  }
}
export const mapCreateFragranceRequestInputToRow = (
  input?: CreateFragranceRequestInput | null
): Partial<FragranceRequestRow> => {
  const { status, concentration } = input ?? {}
  const parsedInput = parseOrThrow(CreateFragranceRequestSchema, input ?? {})
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
  const parsed = parseOrThrow(UpdateFragranceRequestSchema, input)
  const cleaned = removeNullish(parsed)

  const output: Partial<FragranceRequestRow> = cleaned
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
    brandId, requestStatus: dbRequestStatus, fragranceStatus: dbFragranceStatus, concentration: dbConcentration, ...rest
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
