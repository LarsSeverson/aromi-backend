import { SearchService } from '@src/search/services/SearchService.js'
import type { FragranceDoc } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import type { AccordRow, BrandRow, FragranceRow, LayerNoteRow } from '@src/db/index.js'

export interface FromRowParams {
  fragrance: FragranceRow
  brand?: BrandRow | null
  accords?: AccordRow[]
  notes?: LayerNoteRow[]
}

export class FragranceSearchService extends SearchService<FragranceDoc> {
  constructor (sources: DataSources) {
    super(sources, 'fragrances')
  }

  fromRow (params: FromRowParams): FragranceDoc {
    const { fragrance, brand, accords = [], notes = [] } = params

    const docBrand = brand == null
      ? null
      :
      {
        id: brand.id,
        name: brand.name
      }

    const docAccords = accords.map(({ id, name }) => ({ id, name }))
    const docNotes = notes.map(({ id, name, layer }) => ({ id, name, layer }))

    return {
      ...fragrance,
      brand: docBrand,
      accords: docAccords,
      notes: docNotes
    }
  }
}