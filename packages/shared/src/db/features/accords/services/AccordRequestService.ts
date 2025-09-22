import type { AccordRequestRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { AccordRequestVoteService } from './AccordRequestVoteService.js'
import { FeaturedTableService, RequestJobService } from '@src/db/index.js'
import { AccordRequestScoreService } from './AccordRequestScoreService.js'

export class AccordRequestService extends FeaturedTableService<AccordRequestRow> {
  votes: AccordRequestVoteService
  scores: AccordRequestScoreService
  jobs: RequestJobService

  constructor (sources: DataSources) {
    super(sources, 'accordRequests')
    this.votes = new AccordRequestVoteService(sources)
    this.scores = new AccordRequestScoreService(sources)
    this.jobs = new RequestJobService(sources)
  }
}
