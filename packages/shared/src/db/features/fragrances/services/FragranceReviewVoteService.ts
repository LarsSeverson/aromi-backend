import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceReviewVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceReviewVoteService extends FeaturedTableService<FragranceReviewVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceReviewVotes')
  }
}