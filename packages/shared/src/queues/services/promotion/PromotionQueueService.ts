import type { DataSources } from '@src/datasources/index.js'
import { MQueueService } from '../MQueueService.js'
import type { PromotionJobPayload, PromotionJobName } from './types.js'

export class PromotionQueueService extends MQueueService<PromotionJobName, PromotionJobPayload> {
  constructor (sources: DataSources) {
    super(sources, 'promotion')
  }

  getJobId<J extends PromotionJobName>(
    jobName: J,
    data: PromotionJobPayload[J]
  ): string {
    return `${jobName}:${data.requestId}`
  }
}
