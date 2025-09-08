import { type DataSources } from '@src/datasources/index.js'
import { MQueueService } from '../MQueueService.js'
import { type PromotionJobPayload, type PromotionJobName } from './types.js'

export class PromotionQueueService extends MQueueService<PromotionJobName, PromotionJobPayload> {
  getJobId<J extends PromotionJobName>(
    jobName: J,
    data: PromotionJobPayload[J]
  ): string {
    return `${jobName}:${data.id}`
  }

  constructor (sources: DataSources) {
    super(sources, 'promotion')
  }
}
