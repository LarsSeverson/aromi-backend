import type { DataSources } from '@src/datasources/DataSources.js'
import { FragranceNoteVoteService } from './FragranceNoteVoteService.js'
import { FragranceNoteScoreService } from './FragranceNoteScoreService.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB } from '@src/db/db-schema.js'

export class FragranceNoteService {
  votes: FragranceNoteVoteService
  scores: FragranceNoteScoreService

  constructor (sources: DataSources) {
    this.votes = new FragranceNoteVoteService(sources)
    this.scores = new FragranceNoteScoreService(sources)
  }

  findNotes (
    where?: ExpressionOrFactory<DB, 'fragranceNoteScores' | 'notes', SqlBool>
  ) {
    return this.scores.findNotes(where)
  }
}
