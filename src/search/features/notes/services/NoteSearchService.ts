import { SearchService } from '@src/search/services/SearchService'
import { type DataSources } from '@src/datasources'
import { type NoteIndex } from '../types'

export class NoteSearchService extends SearchService<NoteIndex> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }
}
