import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/features/search/services/SearchService.js'
import type { BrandIndex } from '../types.js'

export class BrandSearchService extends SearchService<BrandIndex> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }
}
