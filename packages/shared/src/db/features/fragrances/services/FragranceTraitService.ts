import { FragranceTraitScoreService } from './FragranceTraitScoreService.js'
import type { DataSources } from '@src/datasources/index.js'
import { FragranceTraitVoteService } from './FragranceTraitVoteService.js'

export class FragranceTraitService {
  scores: FragranceTraitScoreService
  votes: FragranceTraitVoteService

  constructor (sources: DataSources) {
    this.scores = new FragranceTraitScoreService(sources)
    this.votes = new FragranceTraitVoteService(sources)
  }
}