import { type DataSources, PromotionQueueService } from '@aromi/shared'
import { IndexationQueueService } from '@aromi/shared'

export class JobQueues {
  promotions: PromotionQueueService
  indexations: IndexationQueueService

  constructor (sources: DataSources) {
    this.promotions = new PromotionQueueService(sources)
    this.indexations = new IndexationQueueService(sources)
  }
}