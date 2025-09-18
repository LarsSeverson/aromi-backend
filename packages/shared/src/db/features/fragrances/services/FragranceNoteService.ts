import type { DataSources } from '@src/datasources/DataSources.js'
import { FragranceNoteVoteService } from './FragranceNoteVoteService.js'
import { FragranceNoteScoreService } from './FragranceNoteScoreService.js'

export class FragranceNoteService {
  votes: FragranceNoteVoteService
  scores: FragranceNoteScoreService

  constructor (sources: DataSources) {
    this.votes = new FragranceNoteVoteService(sources)
    this.scores = new FragranceNoteScoreService(sources)
  }
}
