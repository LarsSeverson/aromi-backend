import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from './TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export type NoteRow = Selectable<DB['notes']>

export class NoteService extends TableService<'notes', NoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'notes')
  }
}
