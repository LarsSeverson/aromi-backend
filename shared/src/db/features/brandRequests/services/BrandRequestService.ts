import { type DataSources } from '@src/datasources'
import { type BrandRequestRow } from '@src/db'
import { BrandRequestImageService } from './BrandRequestImageService'
import { BrandRequestVoteService } from './BrandRequestVoteService'
import { TableService } from '@src/db/services/TableService'

export class BrandRequestService extends TableService<'brandRequests', BrandRequestRow> {
  images: BrandRequestImageService
  votes: BrandRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'brandRequests')

    this.images = new BrandRequestImageService(sources)
    this.votes = new BrandRequestVoteService(sources)
  }
}
