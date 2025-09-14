import type { DataSources } from '@src/datasources/DataSources.js'
import type { NoteRequestVoteCountRow } from '../types.js'
import { TableService } from '@src/db/services/TableService.js'

export class NoteRequestVoteCountService extends TableService<NoteRequestVoteCountRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestVoteCounts')
  }
}