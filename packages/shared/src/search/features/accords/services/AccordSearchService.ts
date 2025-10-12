import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/search/services/SearchService.js'
import type { AccordDoc } from '../types.js'
import type { AccordRow } from '@src/db/index.js'
import type { PartialWithId } from '@src/utils/util-types.js'

export class AccordSearchService extends SearchService<AccordDoc> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }

  fromRow (row: AccordRow): AccordDoc {
    return row
  }

  fromPartialRow (row: PartialWithId<AccordRow>): PartialWithId<AccordDoc> {
    return row
  }
}
