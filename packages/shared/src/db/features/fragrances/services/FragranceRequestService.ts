import type { DataSources } from '@src/datasources/index.js'
import { FeaturedTableService, RequestJobService, type FragranceRequestRow } from '@src/db/index.js'
import { FragranceRequestAccordService } from './FragranceRequestAccordService.js'
import { FragranceRequestNoteService } from './FragranceRequestNoteService.js'
import { FragranceRequestTraitService } from './FragranceRequestTraitService.js'
import { FragranceRequestVoteService } from './FragranceRequestVoteService.js'
import { FragranceRequestScoreService } from './FragranceRequestScoreService.js'

export class FragranceRequestService extends FeaturedTableService<FragranceRequestRow> {
  traits: FragranceRequestTraitService
  accords: FragranceRequestAccordService
  notes: FragranceRequestNoteService
  votes: FragranceRequestVoteService
  scores: FragranceRequestScoreService
  jobs: RequestJobService

  constructor (sources: DataSources) {
    super(sources, 'fragranceRequests')

    this.traits = new FragranceRequestTraitService(sources)
    this.accords = new FragranceRequestAccordService(sources)
    this.notes = new FragranceRequestNoteService(sources)
    this.votes = new FragranceRequestVoteService(sources)
    this.scores = new FragranceRequestScoreService(sources)
    this.jobs = new RequestJobService(sources)
  }
}
