import { TableService } from '@src/db/services/TableService'
import { type FragranceNoteRow } from '../types'
import { type DataSources } from '@src/datasources'

export class FragranceNoteService extends TableService<'fragranceNotes', FragranceNoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceNotes')
  }
}
