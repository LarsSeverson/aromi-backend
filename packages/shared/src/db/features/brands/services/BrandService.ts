import type { DataSources } from '@src/datasources/index.js'
import { BrandImageService } from './BrandImageService.js'
import type { BrandRow } from '../types.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import { BrandEditService } from './BrandEditService.js'
import { BrandRequestService } from './BrandRequestService.js'
import { BrandVoteService } from './BrandVoteService.js'
import { BrandScoreService } from './BrandScoreService.js'

export class BrandService extends FeaturedTableService<BrandRow> {
  images: BrandImageService
  edits: BrandEditService
  requests: BrandRequestService
  votes: BrandVoteService
  scores: BrandScoreService

  constructor (sources: DataSources) {
    super(sources, 'brands')

    this.images = new BrandImageService(sources)
    this.edits = new BrandEditService(sources)
    this.requests = new BrandRequestService(sources)
    this.votes = new BrandVoteService(sources)
    this.scores = new BrandScoreService(sources)
  }
}
