import { type DataSources } from '@src/datasources'
import { MQueueService } from '../MQueueService'
import { type PromotionJobPayloads } from './types'

export class PromotionQueueService extends MQueueService<PromotionJobPayloads> {
  constructor (sources: DataSources) {
    super(sources, 'promotion')
  }
}
