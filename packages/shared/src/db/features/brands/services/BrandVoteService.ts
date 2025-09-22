import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { BrandVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class BrandVoteService extends FeaturedTableService<BrandVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandVotes')
  }
}