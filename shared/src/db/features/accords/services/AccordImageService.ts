import { TableService } from '@src/db/services/TableService'
import { type AccordImageRow } from '../types'
import { type DataSources } from '@src/datasources'

export class AccordImageService extends TableService<'accordImages', AccordImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordImages')
  }
}
