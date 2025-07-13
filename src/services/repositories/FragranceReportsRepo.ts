import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export type FragranceReportRow = Selectable<DB['fragranceReports']>

export class FragranceReportsRepo extends TableService<'fragranceReports', FragranceReportRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceReports')
  }
}
