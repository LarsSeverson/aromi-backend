import { TableService } from '@src/db/services/TableService.js'
import type { FragranceNoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'

export class FragranceNoteService extends TableService<'fragranceNotes', FragranceNoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceNotes')
  }
}
