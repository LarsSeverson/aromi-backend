import { type DataSources } from '@aromi/shared'
import { PromotionQueueService } from '@aromi/shared'

export class ServerQueues {
  promotions: PromotionQueueService

  constructor (sources: DataSources) {
    this.promotions = new PromotionQueueService(sources)
  }
}
