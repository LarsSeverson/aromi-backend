import type { FragranceRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import { FragranceImageService } from './FragranceImageService.js'
import { FragranceAccordService } from './FragranceAccordService.js'
import { FragranceNoteService } from './FragranceNoteService.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import { FragranceEditService } from './FragranceEditService.js'
import { FragranceRequestService } from './FragranceRequestService.js'
import { FragranceVoteService } from './FragranceVoteService.js'
import { FragranceScoreService } from './FragranceScoreService.js'
import { FragranceCollectionService } from './FragranceCollectionService.js'
import { FragranceReviewService } from './FragranceReviewService.js'
import { FragranceReportService } from './FragranceReportService.js'
import { FragranceTraitService } from './FragranceTraitService.js'

export class FragranceService extends FeaturedTableService<FragranceRow> {
  images: FragranceImageService
  accords: FragranceAccordService
  notes: FragranceNoteService
  traits: FragranceTraitService
  edits: FragranceEditService
  requests: FragranceRequestService
  reviews: FragranceReviewService
  votes: FragranceVoteService
  scores: FragranceScoreService
  collections: FragranceCollectionService
  reports: FragranceReportService

  constructor (sources: DataSources) {
    super(sources, 'fragrances')

    this.images = new FragranceImageService(sources)
    this.accords = new FragranceAccordService(sources)
    this.notes = new FragranceNoteService(sources)
    this.traits = new FragranceTraitService(sources)
    this.edits = new FragranceEditService(sources)
    this.requests = new FragranceRequestService(sources)
    this.reviews = new FragranceReviewService(sources)
    this.votes = new FragranceVoteService(sources)
    this.scores = new FragranceScoreService(sources)
    this.collections = new FragranceCollectionService(sources)
    this.reports = new FragranceReportService(sources)
  }
}
