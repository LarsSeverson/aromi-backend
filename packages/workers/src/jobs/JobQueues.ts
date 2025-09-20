import { type DataSources, PromotionQueueService } from '@aromi/shared'
import { IndexationQueueService } from '@aromi/shared'

export class JobQueues {
  promotions: PromotionQueueService
  indexation: IndexationQueueService

  constructor (sources: DataSources) {
    this.promotions = new PromotionQueueService(sources)
    this.indexation = new IndexationQueueService(sources)
  }
}