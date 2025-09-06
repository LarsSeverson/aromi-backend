import { type DataSources } from '@src/datasources'
import { type NoteRow } from '@src/db'
import { TableService } from '@src/db/services/TableService'
import { NoteImageService } from './NoteImageService'

export class NoteService extends TableService<'notes', NoteRow> {
  images: NoteImageService

  constructor (sources: DataSources) {
    super(sources, 'notes')
    this.images = new NoteImageService(sources)
  }
}
