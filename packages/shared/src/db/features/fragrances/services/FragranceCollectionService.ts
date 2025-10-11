import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceCollectionRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { FragranceCollectionItemService } from './FragranceCollectionItemService.js'

export class FragranceCollectionService extends FeaturedTableService<FragranceCollectionRow> {
  items: FragranceCollectionItemService

  constructor (sources: DataSources) {
    super(sources, 'fragranceCollections')
    this.items = new FragranceCollectionItemService(sources)
  }
}