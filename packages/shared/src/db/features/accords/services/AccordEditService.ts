import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { AccordEditRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class AccordEditService extends FeaturedTableService<AccordEditRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordEdits')
  }
}