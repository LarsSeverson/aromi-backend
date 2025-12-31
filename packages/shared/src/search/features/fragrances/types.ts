import type { AccordRow, BrandRow, FragranceRow, LayerNoteRow, NoteLayerEnum } from '@src/db/index.js'

export interface FragranceDocBrand {
  id: string
  name: string
}

export interface FragranceDocAccord {
  id: string
  name: string
}

export interface FragranceDocNote {
  id: string
  name: string
  layer: NoteLayerEnum
}

// Traits maybe

export interface FragranceDoc extends FragranceRow {
  brand: FragranceDocBrand | null
  accords: FragranceDocAccord[]
  notes: FragranceDocNote[]
}

export interface FragraceFromRowParams {
  fragrance: FragranceRow
  brand?: BrandRow | null
  accords?: AccordRow[]
  notes?: LayerNoteRow[]
}
