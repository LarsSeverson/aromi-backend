import { QUEUE_NAMES } from '@aromi/shared'
import { AGGREGATION_JOB_NAMES, type AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import type { WorkerContext } from '@src/context/WorkerContext.js'
import { WorkerService } from '@src/services/WorkerService.js'
import { AccordAggregator } from '../jobs/AccordAggregator.js'
import { NoteAggregator } from '../jobs/NoteAggregator.js'

export class AggregationService extends WorkerService<keyof AggregationJobPayload, AggregationJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.AGGREGATION, context)

    const { sources } = context

    this
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES,
        new AccordAggregator(sources)
      )
      .register(
        AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES,
        new NoteAggregator(sources)
      )
  }
}