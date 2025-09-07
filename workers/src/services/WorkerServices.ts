import { type DataSources } from 'shared/src/datasources'
import { PromotionService } from '../features'

export class WorkerServices {
  promotions: PromotionService

  constructor (sources: DataSources) {
    this.promotions = new PromotionService(sources)
  }
}
