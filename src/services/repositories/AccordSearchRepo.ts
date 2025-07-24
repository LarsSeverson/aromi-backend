import { type ApiDataSources } from '@src/datasources/datasources'
import { SearchService, type BaseIndex } from '../SearchService'

export interface AccordDoc extends BaseIndex {
  name: string
}

export class AccordSearchRepo extends SearchService<AccordDoc> {
  constructor (sources: ApiDataSources) {
    super(sources, 'accords')
  }
}
