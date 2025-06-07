import { SearchService, type BaseIndex } from '../searchService'

export interface FragranceDoc extends BaseIndex {
  name: string
  brand: string
}

export class FragranceSearchRepo extends SearchService<FragranceDoc> {}
