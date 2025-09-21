import type { DataSources } from '@src/datasources/DataSources.js'
import { MQueueService } from '../MQueueService.js'
import { AGGREGATION_JOB_NAMES, type AggregationJobName, type AggregationJobPayload } from './types.js'
import { QUEUE_NAMES } from '@src/queues/types.js'

const jobKeyBuilders = {
  [AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_VOTES]:
    (data: AggregationJobPayload['aggregate-fragrance-votes']) => data.fragranceId,
  [AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REQUEST_VOTES]:
    (data: AggregationJobPayload['aggregate-fragrance-request-votes']) => data.requestId,

  [AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_VOTES]:
    (data: AggregationJobPayload['aggregate-brand-votes']) => data.brandId,
  [AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_REQUEST_VOTES]:
    (data: AggregationJobPayload['aggregate-brand-request-votes']) => data.requestId,

  [AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_REQUEST_VOTES]:
    (data: AggregationJobPayload['aggregate-accord-request-votes']) => data.requestId,
  [AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES]:
    (data: AggregationJobPayload['aggregate-accord-votes']) => `${data.fragranceId}-${data.accordId}`,

  [AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_REQUEST_VOTES]:
    (data: AggregationJobPayload['aggregate-note-request-votes']) => data.requestId,
  [AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES]:
    (data: AggregationJobPayload['aggregate-note-votes']) => `${data.fragranceId}-${data.noteId}-${data.layer}`
}

export class AggregationQueueService extends MQueueService<AggregationJobName, AggregationJobPayload> {
  getJobId<J extends AggregationJobName>(
    jobName: J,
    data: AggregationJobPayload[J]
  ): string {
    const builder = jobKeyBuilders[jobName] as (data: AggregationJobPayload[J]) => string
    return `${jobName}-${builder(data)}`
  }

  constructor (sources: DataSources) {
    super(sources, QUEUE_NAMES.AGGREGATION)
  }
}