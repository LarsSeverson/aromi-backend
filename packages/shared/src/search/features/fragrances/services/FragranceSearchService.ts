import { SearchService } from '@src/search/services/SearchService.js'
import type { FragranceIndex } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceSearchService extends SearchService<FragranceIndex> {
  constructor (sources: DataSources) {
    super(sources, 'fragrances')
  }
}