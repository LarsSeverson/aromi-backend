import { type NoteRequestImageRow } from '@src/db'
import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'

export class NoteRequestImageService extends TableService<'noteRequestImages', NoteRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestImages')
  }
}
