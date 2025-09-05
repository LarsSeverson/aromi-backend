import { type DataSources } from '@src/datasources'
import { type NoteRow } from '@src/db'
import { TableService } from '@src/db/services/TableService'

export class NoteService extends TableService<'notes', NoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }
}
