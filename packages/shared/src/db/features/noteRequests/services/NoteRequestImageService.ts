import type { NoteRequestImageRow } from '@src/db/index.js'
import type { DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'

export class NoteRequestImageService extends TableService<'noteRequestImages', NoteRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestImages')
  }
}
