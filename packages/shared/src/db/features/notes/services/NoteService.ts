import type { DataSources } from '@src/datasources/index.js'
import type { NoteRow } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { NoteImageService } from './NoteImageService.js'

export class NoteService extends TableService<'notes', NoteRow> {
  images: NoteImageService

  constructor (sources: DataSources) {
    super(sources, 'notes')
    this.images = new NoteImageService(sources)
  }
}
