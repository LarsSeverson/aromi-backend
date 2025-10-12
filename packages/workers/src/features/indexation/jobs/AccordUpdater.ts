import { type PartialWithId, unwrapOrThrow, type AccordDoc, type INDEXATION_JOB_NAMES, type IndexationJobPayload } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_ACCORD

export class AccordUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PartialWithId<AccordDoc>> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PartialWithId<AccordDoc>> {
    const accord = job.data

    const doc = await unwrapOrThrow(this.updateAccord(accord))

    return doc
  }

  updateAccord (accord: PartialWithId<AccordDoc>) {
    const { search } = this.context.services
    const { accords } = search

    return accords
      .updateDocument(accord)
      .map(() => accord)
  }
}