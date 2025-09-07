import { type AccordRequestRow } from '../types'
import { type DataSources } from '@src/datasources'
import { AccordRequestImageService } from './AccordRequestImageService'
import { AccordRequestVoteService } from './AccordRequestVoteService'
import { TableService } from '@src/db/services/TableService'

export class AccordRequestService extends TableService<'accordRequests', AccordRequestRow> {
  images: AccordRequestImageService
  votes: AccordRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'accordRequests')

    this.images = new AccordRequestImageService(sources)
    this.votes = new AccordRequestVoteService(sources)
  }
}
