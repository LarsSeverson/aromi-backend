import { TableService } from '@src/server/services/TableService'
import { type DataSources } from '@src/datasources'
import { type NoteRow } from '@src/db/types'

export class NoteService extends TableService<'notes', NoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }
}
