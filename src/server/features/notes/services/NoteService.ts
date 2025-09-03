import { TableService } from '@src/server/services/TableService'
import { type DataSources } from '@src/server/datasources'
import { type NoteRow } from '../types'

export class NoteService extends TableService<'notes', NoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }
}
