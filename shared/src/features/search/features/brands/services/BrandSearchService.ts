import { type DataSources } from '@src/datasources'
import { SearchService } from '@src/features/search/services/SearchService'
import { type BrandIndex } from '../types'

export class BrandSearchService extends SearchService<BrandIndex> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }
}
