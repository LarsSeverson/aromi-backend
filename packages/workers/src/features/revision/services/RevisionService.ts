import { QUEUE_NAMES, REVISION_JOB_NAMES, type RevisionJobPayload } from '@aromi/shared'
import type { WorkerContext } from '@src/context/WorkerContext.js'
import { WorkerService } from '@src/services/WorkerService.js'
import { FragranceReviser } from '../jobs/FragranceReviser.js'
import { AccordReviser } from '../jobs/AccordReviser.js'
import { BrandReviser } from '../jobs/BrandReviser.js'
import { NoteReviser } from '../jobs/NoteReviser.js'

export class RevisionService extends WorkerService<keyof RevisionJobPayload, RevisionJobPayload> {
  constructor (context: WorkerContext) {
    super(QUEUE_NAMES.REVISION, context)

    const { sources } = context

    this
      .register(
        REVISION_JOB_NAMES.REVISE_FRAGRANCE,
        new FragranceReviser(sources)
      )
      .register(
        REVISION_JOB_NAMES.REVISE_ACCORD,
        new AccordReviser(sources)
      )
      .register(
        REVISION_JOB_NAMES.REVISE_BRAND,
        new BrandReviser(sources)
      )
      .register(
        REVISION_JOB_NAMES.REVISE_NOTE,
        new NoteReviser(sources)
      )
  }
}