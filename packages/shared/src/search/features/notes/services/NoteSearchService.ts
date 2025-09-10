import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/search/services/SearchService.js'
import type { NoteIndex } from '../types.js'

export class NoteSearchService extends SearchService<NoteIndex> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }
}
