import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService, RequestJobService, type BrandRequestRow } from '@src/db/index.js'
import { BrandRequestVoteService } from './BrandRequestVoteService.js'

export class BrandRequestService extends FeaturedTableService<BrandRequestRow> {
  votes: BrandRequestVoteService
  jobs: RequestJobService

  constructor (sources: DataSources) {
    super(sources, 'brandRequests')
    this.votes = new BrandRequestVoteService(sources)
    this.jobs = new RequestJobService(sources)
  }
}
