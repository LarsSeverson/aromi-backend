import { type DataSources } from '@src/datasources'
import { type AccordRow } from '@src/db'
import { TableService } from '@src/db/services/TableService'

export class AccordService extends TableService<'accords', AccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'accords')
  }
}
