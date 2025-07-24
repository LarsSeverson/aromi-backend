import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from './TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { AccordSearchRepo } from './repositories/AccordSearchRepo'

export type AccordRow = Selectable<DB['accords']>

export class AccordService extends TableService<'accords', AccordRow> {
  search: AccordSearchRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'accords')

    this.search = new AccordSearchRepo(sources)
  }
}
