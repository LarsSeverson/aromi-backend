import { type DataSources } from '@src/datasources'
import { SearchService } from '@src/features/search/services/SearchService'
import { type AccordIndex } from '../types'

export class AccordSearchService extends SearchService<AccordIndex> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }
}
