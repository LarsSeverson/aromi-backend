import { TableService } from '@src/db/services/TableService.js'
import { type AccordImageRow } from '../types.js'
import { type DataSources } from '@src/datasources/index.js'

export class AccordImageService extends TableService<'accordImages', AccordImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordImages')
  }
}
