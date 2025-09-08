import { type DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/features/search/services/SearchService.js'
import { type NoteIndex } from '../types.js'

export class NoteSearchService extends SearchService<NoteIndex> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }
}
