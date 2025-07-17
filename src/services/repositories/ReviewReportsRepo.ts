import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type DB } from '@src/db/schema'
import { type ApiDataSources } from '@src/datasources/datasources'

export type ReviewReportRow = Selectable<DB['reviewReports']>

export class ReviewReportsRepo extends TableService<'reviewReports', ReviewReportRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'reviewReports')
  }
}
