import type { DataSources } from '@src/datasources/index.js'
import { NoteRequestVoteService } from './NoteRequestVoteService.js'
import { FeaturedTableService, type NoteRequestRow } from '@src/db/index.js'

export class NoteRequestService extends FeaturedTableService<NoteRequestRow> {
  votes: NoteRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'noteRequests')
    this.votes = new NoteRequestVoteService(sources)
  }
}
