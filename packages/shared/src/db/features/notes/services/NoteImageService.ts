import type { NoteImageRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class NoteImageService extends FeaturedTableService<NoteImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteImages')
  }
}
