import { type FragranceDoc, type INDEXATION_JOB_NAMES, type IndexationJobPayload, type PartialWithId, unwrapOrThrow } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_FRAGRANCE

export class FragranceUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PartialWithId<FragranceDoc>> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PartialWithId<FragranceDoc>> {
    const fragrance = job.data

    const doc = await unwrapOrThrow(this.updateFragrance(fragrance))

    return doc
  }

  updateFragrance (fragrance: PartialWithId<FragranceDoc>) {
    const { search } = this.context.services
    const { fragrances } = search

    return fragrances
      .updateDocument(fragrance)
      .map(() => fragrance)
  }
}