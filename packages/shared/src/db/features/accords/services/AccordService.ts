import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService, type AccordRow } from '@src/db/index.js'
import { AccordImageService } from './AccordImageService.js'
import { AccordEditService } from './AccordEditService.js'

export class AccordService extends FeaturedTableService<AccordRow> {
  images: AccordImageService
  edits: AccordEditService

  constructor (sources: DataSources) {
    super(sources, 'accords')

    this.images = new AccordImageService(sources)
    this.edits = new AccordEditService(sources)
  }
}
