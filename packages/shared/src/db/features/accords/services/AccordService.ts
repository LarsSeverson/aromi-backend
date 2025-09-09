import type { DataSources } from '@src/datasources/index.js'
import type { AccordRow } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { AccordImageService } from './AccordImageService.js'

export class AccordService extends TableService<'accords', AccordRow> {
  images: AccordImageService

  constructor (sources: DataSources) {
    super(sources, 'accords')

    this.images = new AccordImageService(sources)
  }
}
