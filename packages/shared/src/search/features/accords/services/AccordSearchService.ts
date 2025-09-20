import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/search/services/SearchService.js'
import type { AccordIndex } from '../types.js'
import type { AccordRow } from '@src/db/index.js'
import type { PartialWithId } from '@src/utils/util-types.js'

export class AccordSearchService extends SearchService<AccordIndex> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }

  fromRow (row: AccordRow): AccordIndex {
    return row
  }

  fromPartialRow (row: PartialWithId<AccordRow>): PartialWithId<AccordIndex> {
    return row
  }
}
