import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/search/services/SearchService.js'
import type { BrandDoc } from '../types.js'
import type { PartialWithId } from '@src/utils/util-types.js'

export class BrandSearchService extends SearchService<BrandDoc> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }

  fromRow (row: BrandDoc): BrandDoc {
    return row
  }

  fromPartialRow (row: PartialWithId<BrandDoc>): PartialWithId<BrandDoc> {
    return row
  }
}
