import type { AccordRequestRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { AccordRequestVoteService } from './AccordRequestVoteService.js'
import { FeaturedTableService } from '@src/db/index.js'

export class AccordRequestService extends FeaturedTableService<AccordRequestRow> {
  votes: AccordRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'accordRequests')
    this.votes = new AccordRequestVoteService(sources)
  }
}
