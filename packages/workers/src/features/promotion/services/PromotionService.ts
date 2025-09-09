import { PROMOTION_JOB_NAMES, type PromotionJobPayload, QUEUE_NAMES } from '@aromi/shared'
import { WorkerService } from '@src/services/WorkerService.js'
import { FragrancePromoter } from '../jobs/FragrancePromoter.js'
import { BrandPromoter } from '../jobs/BrandPromoter.js'
import { AccordPromoter } from '../jobs/AccordPromoter.js'
import { NotePromoter } from '../jobs/NotePromoter.js'
import type { WorkerContext } from '@src/context/WorkerContext.js'

export class PromotionService extends WorkerService<keyof PromotionJobPayload, PromotionJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.PROMOTION, context)

    const { sources } = context

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
