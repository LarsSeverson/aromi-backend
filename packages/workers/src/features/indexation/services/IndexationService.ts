import { QUEUE_NAMES } from '@aromi/shared'
import { INDEXATION_JOB_NAMES, type IndexationJobPayload } from '@aromi/shared'
import type { WorkerContext } from '@src/context/WorkerContext.js'
import { WorkerService } from '@src/services/WorkerService.js'
import { FragranceIndexer } from '../jobs/FragranceIndexer.js'
import { BrandIndexer } from '../jobs/BrandIndexer.js'
import { AccordIndexer } from '../jobs/AccordIndexer.js'
import { NoteIndexer } from '../jobs/NoteIndexer.js'
import { FragranceUpdater } from '../jobs/FragranceUpdater.js'
import { BrandUpdater } from '../jobs/BrandUpdater.js'
import { AccordUpdater } from '../jobs/AccordUpdater.js'
import { NoteUpdater } from '../jobs/NoteUpdater.js'

export class IndexationService extends WorkerService<keyof IndexationJobPayload, IndexationJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.INDEXATION, context)

    const { sources } = context

    this
      .register(
        INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        new FragranceIndexer(sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_FRAGRANCE,
        new FragranceUpdater(sources)
      )

      .register(
        INDEXATION_JOB_NAMES.INDEX_BRAND,
        new BrandIndexer(sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_BRAND,
        new BrandUpdater(sources)
      )

      .register(
        INDEXATION_JOB_NAMES.INDEX_ACCORD,
        new AccordIndexer(sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_ACCORD,
        new AccordUpdater(sources)
      )

      .register(
        INDEXATION_JOB_NAMES.INDEX_NOTE,
        new NoteIndexer(sources)
      )
      .register(
        INDEXATION_JOB_NAMES.UPDATE_NOTE,
        new NoteUpdater(sources)
      )
  }
}