import { type DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/features/search/services/SearchService.js'
import { type AccordIndex } from '../types.js'

export class AccordSearchService extends SearchService<AccordIndex> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }
}
