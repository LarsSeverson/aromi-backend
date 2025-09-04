import { SearchService } from '@src/search/services/SearchService'
import { type AccordIndex } from '../types'
import { type DataSources } from '@src/datasources'

export class AccordSearchService extends SearchService<AccordIndex> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }
}
