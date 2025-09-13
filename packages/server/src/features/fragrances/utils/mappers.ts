import type { NoteLayerEnum, FragranceStatus as DBFragranceStatus, FragranceConcentration, FragranceRow } from '@aromi/shared'
import type { FragranceStatus, Concentration, NoteLayer } from '@src/graphql/gql-types.js'
import type { IFragranceSummary } from '../types.js'

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
  const { id, name, description, concentration, status, releaseYear } = row

  return {
    id,
    name,
    description,
    concentration: mapDBConcentrationToGQLConcentration(concentration),
    status: mapDBStatusToGQLStatus(status),
    releaseYear: releaseYear ?? 1890
  }
}