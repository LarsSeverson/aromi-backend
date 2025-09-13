import type { AccordRequestRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { AccordRequestImageService } from './AccordRequestImageService.js'
import { AccordRequestVoteService } from './AccordRequestVoteService.js'
import { FeaturedTableService } from '@src/db/index.js'

export class AccordRequestService extends FeaturedTableService<AccordRequestRow> {
  images: AccordRequestImageService
  votes: AccordRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'accordRequests')

    this.images = new AccordRequestImageService(sources)
    this.votes = new AccordRequestVoteService(sources)
  }
}
