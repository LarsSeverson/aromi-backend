import { TableService } from '@src/services/TableService'
import { type AccordRow } from '../types'
import { type DataSources } from '@src/datasources'

export class AccordService extends TableService<'accords', AccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }
}
