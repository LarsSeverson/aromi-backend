import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/search/services/SearchService.js'
import type { NoteIndex } from '../types.js'
import type { PartialWithId } from '@src/utils/util-types.js'

export class NoteSearchService extends SearchService<NoteIndex> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }

  fromRow (row: NoteIndex): NoteIndex {
    return row
  }

  fromPartialRow (row: PartialWithId<NoteIndex>): PartialWithId<NoteIndex> {
    return row
  }
}
