import type { WorkerContext } from '@src/context/WorkerContext.js'
import { PromotionService } from '@src/features/promotion/services/PromotionService.js'
import { SearchSyncService } from '@src/features/search-sync/services/SearchSyncService.js'

export class WorkerServices {
  promotions: PromotionService
  searchSync: SearchSyncService

  constructor (context: WorkerContext) {
    this.promotions = new PromotionService(context)
    this.searchSync = new SearchSyncService(context)
  }
}
