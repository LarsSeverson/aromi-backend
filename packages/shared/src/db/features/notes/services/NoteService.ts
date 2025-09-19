import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService, type NoteRow } from '@src/db/index.js'
import { NoteImageService } from './NoteImageService.js'
import { NoteEditService } from './NoteEditService.js'

export class NoteService extends FeaturedTableService<NoteRow> {
  images: NoteImageService
  edits: NoteEditService

  constructor (sources: DataSources) {
    super(sources, 'notes')
    this.images = new NoteImageService(sources)
    this.edits = new NoteEditService(sources)
  }
}
