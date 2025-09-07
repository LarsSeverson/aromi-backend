import { type DataSources } from '@src/datasources'
import { type AccordRow } from '@src/db'
import { TableService } from '@src/db/services/TableService'
import { AccordImageService } from './AccordImageService'

export class AccordService extends TableService<'accords', AccordRow> {
  images: AccordImageService

  constructor (sources: DataSources) {
    super(sources, 'accords')

    this.images = new AccordImageService(sources)
  }
}
