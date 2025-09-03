import { TableService } from '@src/server/services/TableService'
import { type AccordRow } from '../types'
import { type DataSources } from '@src/server/datasources'

export class AccordService extends TableService<'accords', AccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }
}
