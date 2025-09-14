import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService, type BrandRequestRow } from '@src/db/index.js'
import { BrandRequestImageService } from './BrandRequestImageService.js'
import { BrandRequestVoteService } from './BrandRequestVoteService.js'

export class BrandRequestService extends FeaturedTableService<BrandRequestRow> {
  images: BrandRequestImageService
  votes: BrandRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'brandRequests')

    this.images = new BrandRequestImageService(sources)
    this.votes = new BrandRequestVoteService(sources)
  }
}
