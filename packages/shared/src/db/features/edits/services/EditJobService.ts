import { TableService } from '@src/db/services/TableService.js'
import type { EditJobRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class EditJobService extends TableService<EditJobRow> {
  constructor (sources: DataSources) {
    super(sources, 'editJobs')
  }
}