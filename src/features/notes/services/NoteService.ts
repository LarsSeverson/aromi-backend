import { TableService } from '@src/services/TableService'
import { type DataSources } from '@src/datasources'
import { type NoteRow } from '../types'

export class NoteService extends TableService<'notes', NoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }
}
