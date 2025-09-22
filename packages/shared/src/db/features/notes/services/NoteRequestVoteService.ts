import type { DataSources } from '@src/datasources/index.js'
import { type NoteRequestVoteRow, TableService } from '@src/db/index.js'

export class NoteRequestVoteService extends TableService<NoteRequestVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestVotes')
  }
}
