import type { NoteLayerEnum, FragranceStatus as DBFragranceStatus, FragranceConcentration } from '@aromi/shared'
import type { FragranceStatus, Concentration, NoteLayer } from '@src/graphql/gql-types.js'

export const mapGQLConcentrationToDBConcentration = (
  concentration: Concentration | null
): FragranceConcentration | null => {
  return concentration
}

export const mapDBConcentrationToGQLConcentration = (
  concentration: FragranceConcentration
): Concentration => {
  return concentration as Concentration
}

export const mapGQLStatusToDBStatus = (
  status: FragranceStatus
): DBFragranceStatus => {
  return status
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
