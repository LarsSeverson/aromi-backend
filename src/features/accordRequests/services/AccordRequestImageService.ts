import { TableService } from '@src/services/TableService'
import { type AccordRequestImageRow } from '../types'
import { type DataSources } from '@src/datasources'

export class AccordRequestImageService extends TableService<'accordRequestImages', AccordRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordRequestImages')
  }
}
