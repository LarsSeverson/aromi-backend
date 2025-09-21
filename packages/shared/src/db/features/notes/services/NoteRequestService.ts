import type { DataSources } from '@src/datasources/index.js'
import { NoteRequestVoteService } from './NoteRequestVoteService.js'
import { FeaturedTableService, RequestJobService, type NoteRequestRow } from '@src/db/index.js'

export class NoteRequestService extends FeaturedTableService<NoteRequestRow> {
  votes: NoteRequestVoteService
  jobs: RequestJobService

  constructor (sources: DataSources) {
    super(sources, 'noteRequests')
    this.votes = new NoteRequestVoteService(sources)
    this.jobs = new RequestJobService(sources)
  }
}
