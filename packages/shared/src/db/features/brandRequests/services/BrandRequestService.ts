import { type DataSources } from '@src/datasources/index.js'
import { type BrandRequestRow } from '@src/db/index.js'
import { BrandRequestImageService } from './BrandRequestImageService.js'
import { BrandRequestVoteService } from './BrandRequestVoteService.js'
import { TableService } from '@src/db/services/TableService.js'

export class BrandRequestService extends TableService<'brandRequests', BrandRequestRow> {
  images: BrandRequestImageService
  votes: BrandRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'brandRequests')

    this.images = new BrandRequestImageService(sources)
    this.votes = new BrandRequestVoteService(sources)
  }
}
