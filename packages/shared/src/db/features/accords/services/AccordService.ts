import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService, type AccordRow } from '@src/db/index.js'
import { AccordImageService } from './AccordImageService.js'

export class AccordService extends FeaturedTableService<AccordRow> {
  images: AccordImageService

  constructor (sources: DataSources) {
    super(sources, 'accords')

    this.images = new AccordImageService(sources)
  }
}
