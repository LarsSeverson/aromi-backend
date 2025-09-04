import { TableService } from '@src/server/services/TableService'
import { type NoteRequestImageRow } from '../types'
import { type DataSources } from '@src/datasources'

export class NoteRequestImageService extends TableService<'noteRequestImages', NoteRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestImages')
  }
}
