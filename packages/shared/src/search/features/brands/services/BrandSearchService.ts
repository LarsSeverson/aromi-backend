import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/search/services/SearchService.js'
import type { BrandIndex } from '../types.js'
import type { PartialWithId } from '@src/utils/util-types.js'

export class BrandSearchService extends SearchService<BrandIndex> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }

  fromRow (row: BrandIndex): BrandIndex {
    return row
  }

  fromPartialRow (row: PartialWithId<BrandIndex>): PartialWithId<BrandIndex> {
    return row
  }
}
