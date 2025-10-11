import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceCollectionItemRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceCollectionItemService extends FeaturedTableService<FragranceCollectionItemRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceCollectionItems')
  }
}