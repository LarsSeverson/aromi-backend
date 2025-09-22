import type { DataSources } from '@src/datasources/index.js'
import { NoteRequestVoteService } from './NoteRequestVoteService.js'
import { FeaturedTableService, RequestJobService, type NoteRequestRow } from '@src/db/index.js'
import { NoteRequestScoreService } from './NoteRequestScoreService.js'

export class NoteRequestService extends FeaturedTableService<NoteRequestRow> {
  votes: NoteRequestVoteService
  scores: NoteRequestScoreService
  jobs: RequestJobService

  constructor (sources: DataSources) {
    super(sources, 'noteRequests')
    this.votes = new NoteRequestVoteService(sources)
    this.scores = new NoteRequestScoreService(sources)
    this.jobs = new RequestJobService(sources)
  }
}
