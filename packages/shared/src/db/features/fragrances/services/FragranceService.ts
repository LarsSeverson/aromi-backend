import type { FragranceRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { FragranceImageService } from './FragranceImageService.js'
import { FragranceAccordService } from './FragranceAccordService.js'
import { FragranceNoteService } from './FragranceNoteService.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import { FragranceTraitVoteService } from './FragranceTraitVoteService.js'
import { FragranceEditService } from './FragranceEditService.js'
import { FragranceRequestService } from './FragranceRequestService.js'
import { FragranceVoteService } from './FragranceVoteService.js'
import { FragranceScoreService } from './FragranceScoreService.js'

export class FragranceService extends FeaturedTableService<FragranceRow> {
  images: FragranceImageService
  accords: FragranceAccordService
  notes: FragranceNoteService
  traitVotes: FragranceTraitVoteService
  edits: FragranceEditService
  requests: FragranceRequestService
  votes: FragranceVoteService
  scores: FragranceScoreService

  constructor (sources: DataSources) {
    super(sources, 'fragrances')

    this.images = new FragranceImageService(sources)
    this.accords = new FragranceAccordService(sources)
    this.notes = new FragranceNoteService(sources)
    this.traitVotes = new FragranceTraitVoteService(sources)
    this.edits = new FragranceEditService(sources)
    this.requests = new FragranceRequestService(sources)
    this.votes = new FragranceVoteService(sources)
    this.scores = new FragranceScoreService(sources)
  }
}
