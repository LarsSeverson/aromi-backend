import { TableService } from '@src/db/services/TableService.js'
import type { RequestJobRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class RequestJobService extends TableService<RequestJobRow> {
  constructor (sources: DataSources) {
    super(sources, 'requestJobs')
  }
}