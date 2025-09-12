import type { DataSources } from '@src/datasources/DataSources.js'
import { TableService } from '@src/db/services/TableService.js'
import type { NoteRequestVoteCountRow } from '../types.js'

export class NoteRequestVoteCountService extends TableService<'noteRequestVoteCounts', NoteRequestVoteCountRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestVoteCounts')
  }
}