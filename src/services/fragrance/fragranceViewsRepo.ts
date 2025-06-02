import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type DB } from '@src/db/schema'
import { type ApiDataSources } from '@src/datasources/datasources'

export type FragranceViewRow = Selectable<DB['fragranceViews']>

export class FragranceViewsRepo extends TableService<'fragranceViews', FragranceViewRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceViews')
  }
}
