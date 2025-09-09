import type { WorkerContext } from '@src/context/WorkerContext.js'
import { PromotionService } from '@src/features/promotion/services/PromotionService.js'

export class WorkerServices {
  promotions: PromotionService

  constructor (context: WorkerContext) {
    this.promotions = new PromotionService(context)
  }
}
