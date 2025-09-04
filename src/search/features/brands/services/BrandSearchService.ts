import { SearchService } from '@src/search/services/SearchService'
import { type DataSources } from '@src/datasources'
import { type BrandIndex } from '../types'

export class BrandSearchService extends SearchService<BrandIndex> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }
}
