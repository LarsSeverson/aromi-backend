import type { DataSources } from '@src/datasources/index.js'
import { FragranceAccordVoteService } from './FragranceAccordVoteService.js'
import { FragranceAccordScoreService } from './FragranceAccordScoreService.js'
import type { DB } from '@src/db/db-schema.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'

export class FragranceAccordService {
  votes: FragranceAccordVoteService
  scores: FragranceAccordScoreService

  constructor (sources: DataSources) {
    this.votes = new FragranceAccordVoteService(sources)
    this.scores = new FragranceAccordScoreService(sources)
  }

  findAccords (
    where?: ExpressionOrFactory<DB, 'fragranceAccordScores' | 'accords', SqlBool>
  ) {
    return this.scores.findAccords(where)
  }
}
