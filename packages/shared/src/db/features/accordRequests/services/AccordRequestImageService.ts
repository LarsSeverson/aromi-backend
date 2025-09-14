import { TableService } from '@src/db/services/TableService.js'
import type { AccordRequestImageRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'

export class AccordRequestImageService extends TableService<AccordRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordRequestImages')
  }
}
