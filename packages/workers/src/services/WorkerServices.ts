import type { WorkerContext } from '@src/context/WorkerContext.js'
import { PromotionService } from '@src/features/promotion/services/PromotionService.js'
import { RevisionService } from '@src/features/revision/services/RevisionService.js'
import { IndexationService } from '@src/features/indexation/services/IndexationService.js'
import { AggregationService } from '@src/features/aggregation/services/AggregationService.js'

export class WorkerServices {
  promotions: PromotionService
  indexations: IndexationService
  revisions: RevisionService
  aggregations: AggregationService

  constructor (context: WorkerContext) {
    this.promotions = new PromotionService(context)
    this.indexations = new IndexationService(context)
    this.revisions = new RevisionService(context)
    this.aggregations = new AggregationService(context)
  }
}
