import { TableService, type NoteRequestImageRow } from '@src/db/index.js'
import type { DataSources } from '@src/datasources/index.js'

export class NoteRequestImageService extends TableService<NoteRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestImages')
  }
}
