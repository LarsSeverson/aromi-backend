import { AggregationQueueService, type DataSources, IndexationQueueService, PromotionQueueService, RevisionQueueService } from '@aromi/shared'

export class ServerQueues {
  promotions: PromotionQueueService
  revisions: RevisionQueueService
  indexations: IndexationQueueService
  aggregations: AggregationQueueService

  constructor (sources: DataSources) {
    this.promotions = new PromotionQueueService(sources)
    this.revisions = new RevisionQueueService(sources)
    this.indexations = new IndexationQueueService(sources)
    this.aggregations = new AggregationQueueService(sources)
  }
}
