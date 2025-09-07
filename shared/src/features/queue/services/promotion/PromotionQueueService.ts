import { type DataSources } from '@src/datasources'
import { MQueueService } from '../MQueueService'
import { type PromotionJobPayload, type PromotionJobName } from './types'

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
