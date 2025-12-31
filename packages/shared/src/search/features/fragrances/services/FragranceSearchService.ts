import { SearchService } from '@src/search/services/SearchService.js'
import type { FragranceDoc, FragraceFromRowParams } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceSearchService extends SearchService<FragranceDoc> {
  constructor (sources: DataSources) {
    super(sources, 'fragrances')
  }

  fromRow (params: FragraceFromRowParams): FragranceDoc {
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

  override createIndex () {
    return super.createIndex({ primaryKey: 'id' })
  }

  override configureIndex () {
    return super.configureIndex({
      searchableAttributes: [
        'name',
        'description',
        'brand.name',
        'accords.name',
        'notes.name'
      ],
      sortableAttributes: [
        'createdAt',
        'updatedAt'
      ]
    })
  }
}