import { TableService } from '@src/db/services/TableService.js'
import type { NoteImageRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'

export class NoteImageService extends TableService<'noteImages', NoteImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteImages')
  }
}
