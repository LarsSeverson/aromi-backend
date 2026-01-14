import { AGGREGATION_JOB_NAMES, type AggregationJobPayload, QUEUE_NAMES } from '@aromi/shared'
import type { WorkerContext } from '@src/context/WorkerContext.js'
import { WorkerService } from '@src/services/WorkerService.js'
import { AccordAggregator } from '../jobs/AccordAggregator.js'
import { NoteAggregator } from '../jobs/NoteAggregator.js'
import { AccordRequestAggregator } from '../jobs/AccordRequestAggregator.js'
import { BrandRequestAggregator } from '../jobs/BrandRequestAggregator.js'
import { NoteRequestAggregator } from '../jobs/NoteRequestAggregator.js'
import { FragranceRequestAggregator } from '../jobs/FragranceRequestAggregator.js'
import { FragranceVotesAggregator } from '../jobs/FragranceVotesAggregator.js'
import { BrandAggregator } from '../jobs/BrandAggregator.js'
import { ReviewAggregator } from '../jobs/ReviewAggregator.js'
import { FragranceReviewsAggregator } from '../jobs/FragranceReviewsAggregator.js'
import { PostAggregator } from '../jobs/PostAggregator.js'
import { PostCommentAggregator } from '../jobs/PostCommentAggregator.js'

export class AggregationService extends WorkerService<keyof AggregationJobPayload, AggregationJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.AGGREGATION, context)

    const { sources } = context

    this
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REVIEWS,
        new FragranceReviewsAggregator(sources)
      )
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_VOTES,
        new FragranceVotesAggregator(sources)
      )
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REQUEST_VOTES,
        new FragranceRequestAggregator(sources)
      )

      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_VOTES,
        new BrandAggregator(sources)
      )
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_REQUEST_VOTES,
        new BrandRequestAggregator(sources)
      )

      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES,
        new AccordAggregator(sources)
      )
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_REQUEST_VOTES,
        new AccordRequestAggregator(sources)
      )

      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES,
        new NoteAggregator(sources)
      )
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_REQUEST_VOTES,
        new NoteRequestAggregator(sources)
      )
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_REVIEW_VOTES,
        new ReviewAggregator(sources)
      )

      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_POST,
        new PostAggregator(sources)
      )
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_POST_COMMENT,
        new PostCommentAggregator(sources)
      )
  }
}