import { type DataSources } from '@src/datasources'
import { SearchService } from '@src/features/search/services/SearchService'
import { type NoteIndex } from '../types'

export class NoteSearchService extends SearchService<NoteIndex> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }
}
