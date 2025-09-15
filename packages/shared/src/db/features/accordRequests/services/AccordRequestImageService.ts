import type { AccordRequestImageRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class AccordRequestImageService extends FeaturedTableService<AccordRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordRequestImages')
  }
}
