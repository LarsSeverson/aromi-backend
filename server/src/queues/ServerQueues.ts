import { type DataSources } from '@aromi/shared/datasources'
import { PromotionQueueService } from '@aromi/shared/features/queue'

export class ServerQueues {
  promotions: PromotionQueueService

  constructor (sources: DataSources) {
    this.promotions = new PromotionQueueService(sources)
  }
}
