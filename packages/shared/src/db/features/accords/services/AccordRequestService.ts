import type { AccordRequestRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { AccordRequestVoteService } from './AccordRequestVoteService.js'
import { FeaturedTableService, RequestJobService } from '@src/db/index.js'

export class AccordRequestService extends FeaturedTableService<AccordRequestRow> {
  votes: AccordRequestVoteService
  jobs: RequestJobService

  constructor (sources: DataSources) {
    super(sources, 'accordRequests')
    this.votes = new AccordRequestVoteService(sources)
    this.jobs = new RequestJobService(sources)
  }
}
