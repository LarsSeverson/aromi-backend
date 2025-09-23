import type { DataSources } from '@src/datasources/DataSources.js'
import { MQueueService } from '../MQueueService.js'
import type { AggregationJobName, AggregationJobPayload } from './types.js'
import { QUEUE_NAMES } from '@src/queues/types.js'
import { nanoid } from 'nanoid'

export class AggregationQueueService extends MQueueService<AggregationJobName, AggregationJobPayload> {
  getJobId<J extends AggregationJobName>(
    jobName: J,
    data: AggregationJobPayload[J]
  ): string {
    const id = nanoid()
    return `${jobName}-${id}`
  }

  constructor (sources: DataSources) {
    super(sources, QUEUE_NAMES.AGGREGATION)
  }
}