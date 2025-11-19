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
import { FragranceCollectionService } from './FragranceCollectionService.js'
import { FragranceReviewService } from './FragranceReviewService.js'
import { FragranceReportService } from './FragranceReportService.js'
import type { QueryOptions } from '@src/db/types.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'

export class FragranceService extends FeaturedTableService<FragranceRow> {
  images: FragranceImageService
  accords: FragranceAccordService
  notes: FragranceNoteService
  traitVotes: FragranceTraitVoteService
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
    this.traitVotes = new FragranceTraitVoteService(sources)
    this.edits = new FragranceEditService(sources)
    this.requests = new FragranceRequestService(sources)
    this.reviews = new FragranceReviewService(sources)
    this.votes = new FragranceVoteService(sources)
    this.scores = new FragranceScoreService(sources)
    this.collections = new FragranceCollectionService(sources)
    this.reports = new FragranceReportService(sources)
  }

  findLikedFragrances <C>(
    userId: string,
    options?: QueryOptions<C, 'fragrances', FragranceRow>
  ) {
    const { pagination } = options ?? {}

    let query = this.db
      .selectFrom('fragrances')
      .selectAll('fragrances')
      .innerJoin('fragranceVotes', join =>
        join
          .onRef('fragrances.id', '=', 'fragranceVotes.fragranceId')
          .on('fragranceVotes.userId', '=', userId)
          .on('fragranceVotes.vote', '=', 1)
          .on('fragranceVotes.deletedAt', 'is', null)
      )

    if (pagination != null) {
      const { first, operator, direction, cursor } = pagination
      query = query
        .$if(cursor.isValid, qb =>
          qb.where(w =>
            w.or([
              w.eb('fragranceVotes.createdAt', operator, cursor.value as string),
              w.and([
                w.eb('fragranceVotes.createdAt', '=', cursor.value as string),
                w.eb('fragrances.id', operator, cursor.lastId)
              ])
            ])
          )
        )
        .orderBy('fragranceVotes.createdAt', direction)
        .orderBy('fragrances.id', direction)
        .limit(first + 1)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }
}
