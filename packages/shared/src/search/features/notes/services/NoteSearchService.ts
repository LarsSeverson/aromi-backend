import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/search/services/SearchService.js'
import type { NoteDoc } from '../types.js'
import type { PartialWithId } from '@src/utils/util-types.js'

export class NoteSearchService extends SearchService<NoteDoc> {
  constructor (sources: DataSources) {
    super(sources, 'notes')
  }

  fromRow (row: NoteDoc): NoteDoc {
    return row
  }

  fromPartialRow (row: PartialWithId<NoteDoc>): PartialWithId<NoteDoc> {
    return row
  }
}
