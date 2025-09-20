import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService, type BrandRequestRow } from '@src/db/index.js'
import { BrandRequestVoteService } from './BrandRequestVoteService.js'

export class BrandRequestService extends FeaturedTableService<BrandRequestRow> {
  votes: BrandRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'brandRequests')
    this.votes = new BrandRequestVoteService(sources)
  }
}
