import { type NoteLayerEnum } from '@src/db/schema'
import { type FragranceStatus, type Concentration, type NoteLayer } from '@src/generated/gql-types'

export const mapGQLConcentrationToDBConcentration = (
  concentration: Concentration | null
): string | null => {
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
