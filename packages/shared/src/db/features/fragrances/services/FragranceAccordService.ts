import type { DataSources } from '@src/datasources/index.js'
import { FragranceAccordVoteService } from './FragranceAccordVoteService.js'
import { FragranceAccordScoreService } from './FragranceAccordScoreService.js'

export class FragranceAccordService {
  votes: FragranceAccordVoteService
  scores: FragranceAccordScoreService

  constructor (sources: DataSources) {
    this.votes = new FragranceAccordVoteService(sources)
    this.scores = new FragranceAccordScoreService(sources)
  }
}
