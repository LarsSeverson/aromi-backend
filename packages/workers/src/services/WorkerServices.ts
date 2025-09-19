import type { WorkerContext } from '@src/context/WorkerContext.js'
import { PromotionService } from '@src/features/promotion/services/PromotionService.js'
import { RevisionService } from '@src/features/revision/services/RevisionService.js'
import { SearchSyncService } from '@src/features/search-sync/services/SearchSyncService.js'

export class WorkerServices {
  promotions: PromotionService
  searchSync: SearchSyncService
  revisions: RevisionService

  constructor (context: WorkerContext) {
    this.promotions = new PromotionService(context)
    this.searchSync = new SearchSyncService(context)
    this.revisions = new RevisionService(context)
  }
}
