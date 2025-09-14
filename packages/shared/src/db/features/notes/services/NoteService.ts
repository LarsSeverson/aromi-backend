import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService, type NoteRow } from '@src/db/index.js'
import { NoteImageService } from './NoteImageService.js'

export class NoteService extends FeaturedTableService<NoteRow> {
  images: NoteImageService

  constructor (sources: DataSources) {
    super(sources, 'notes')
    this.images = new NoteImageService(sources)
  }
}
