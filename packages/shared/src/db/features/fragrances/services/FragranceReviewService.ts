import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceReviewRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { FragranceReviewVoteService } from './FragranceReviewVoteService.js'
import { FragranceReviewScoreService } from './FragranceReviewScoreService.js'

export class FragranceReviewService extends FeaturedTableService<FragranceReviewRow> {
  votes: FragranceReviewVoteService
  scores: FragranceReviewScoreService

  constructor (sources: DataSources) {
    super(sources, 'fragranceReviews')
    this.votes = new FragranceReviewVoteService(sources)
    this.scores = new FragranceReviewScoreService(sources)
  }
}