import { type DataSources, PromotionQueueService } from '@aromi/shared'
import { SearchSyncQueueService } from '@aromi/shared'

export class JobQueues {
  promotions: PromotionQueueService
  searchSync: SearchSyncQueueService

  constructor (sources: DataSources) {
    this.promotions = new PromotionQueueService(sources)
    this.searchSync = new SearchSyncQueueService(sources)
  }
}