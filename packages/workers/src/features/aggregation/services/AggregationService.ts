import { AGGREGATION_JOB_NAMES, type AggregationJobPayload, QUEUE_NAMES } from '@aromi/shared'
import type { WorkerContext } from '@src/context/WorkerContext.js'
import { WorkerService } from '@src/services/WorkerService.js'
import { AccordAggregator } from '../jobs/AccordAggregator.js'
import { NoteAggregator } from '../jobs/NoteAggregator.js'
import { AccordRequestAggregator } from '../jobs/AccordRequestAggregator.js'
import { BrandRequestAggregator } from '../jobs/BrandRequestAggregator.js'
import { NoteRequestAggregator } from '../jobs/NoteRequestAggregator.js'
import { FragranceRequestAggregator } from '../jobs/FragranceRequestAggregator.js'
import { FragranceAggregator } from '../jobs/FragranceAggregator.js'
import { BrandAggregator } from '../jobs/BrandAggregator.js'

export class AggregationService extends WorkerService<keyof AggregationJobPayload, AggregationJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.AGGREGATION, context)

    const { sources } = context

    this
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_VOTES,
        new FragranceAggregator(sources)
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
  }
}