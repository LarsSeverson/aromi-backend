import { type ApiDataSources } from '@src/datasources/datasources'
import { SearchService, type BaseIndex } from '../SearchService'

export interface FragranceDoc extends BaseIndex {
  name: string
  brand: string
}

export class FragranceSearchRepo extends SearchService<FragranceDoc> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragrances')
  }
}
