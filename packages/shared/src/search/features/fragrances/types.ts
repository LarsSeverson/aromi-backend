import type { FragranceRow, NoteLayerEnum } from '@src/db/index.js'

export interface FragranceIndexBrand {
  id: string
  name: string
}

export interface FragranceIndexAccord {
  id: string
  name: string
}

export interface FragranceIndexNote {
  id: string
  name: string
  layer: NoteLayerEnum
}

// Traits maybe

export interface FragranceIndex extends FragranceRow {
  brand: FragranceIndexBrand | null
  accords: FragranceIndexAccord[]
  notes: FragranceIndexNote[]
}
