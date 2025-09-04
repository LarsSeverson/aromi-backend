import { TableService } from '@src/server/services/TableService'
import { type DataSources } from '@src/datasources'
import { type AccordRow } from '@src/db'

export class AccordService extends TableService<'accords', AccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }
}
