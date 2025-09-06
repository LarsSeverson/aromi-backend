import { type DataSources } from '@src/datasources'
import { PromotionQueueService } from '@src/features/queue'

export class ServerQueues {
  promotions: PromotionQueueService

  constructor (sources: DataSources) {
    this.promotions = new PromotionQueueService(sources)
  }
}
