import { PROMOTION_JOB_NAMES, QUEUE_NAMES, type PromotionJobPayload } from '@src/features/queue'
import { BrandPromoter } from '../jobs/BrandPromoter'
import { AccordPromoter } from '../jobs/AccordPromoter'
import { NotePromoter } from '../jobs/NotePromoter'
import { type DataSources } from 'shared/src/datasources'
import { WorkerService } from '@src/services/WorkerService'
import { FragrancePromoter } from '../jobs/FragrancePromoter'

export class PromotionService extends WorkerService<keyof PromotionJobPayload, PromotionJobPayload> {
  constructor (sources: DataSources) {
    super(QUEUE_NAMES.PROMOTION)

    this
      .register(
        PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE,
        new FragrancePromoter(sources)
      )
      .register(
        PROMOTION_JOB_NAMES.PROMOTE_BRAND,
        new BrandPromoter(sources)
      )
      .register(
        PROMOTION_JOB_NAMES.PROMOTE_ACCORD,
        new AccordPromoter(sources)
      )
      .register(
        PROMOTION_JOB_NAMES.PROMOTE_NOTE,
        new NotePromoter(sources)
      )
  }
}
