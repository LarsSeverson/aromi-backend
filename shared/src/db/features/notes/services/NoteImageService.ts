import { TableService } from '@src/db/services/TableService'
import { type NoteImageRow } from '../types'
import { type DataSources } from '@src/datasources'

export class NoteImageService extends TableService<'noteImages', NoteImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteImages')
  }
}
