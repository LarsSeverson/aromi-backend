import { type DataSources, PromotionQueueService, RevisionQueueService } from '@aromi/shared'

export class ServerQueues {
  promotions: PromotionQueueService
  revisions: RevisionQueueService

  constructor (sources: DataSources) {
    this.promotions = new PromotionQueueService(sources)
    this.revisions = new RevisionQueueService(sources)
  }
}
