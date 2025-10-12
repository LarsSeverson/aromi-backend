import { type BrandDoc, type INDEXATION_JOB_NAMES, type IndexationJobPayload, type PartialWithId, unwrapOrThrow } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_BRAND

export class BrandUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PartialWithId<BrandDoc>> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PartialWithId<BrandDoc>> {
    const brand = job.data

    const doc = await unwrapOrThrow(this.updateBrand(brand))

    return doc
  }

  updateBrand (brand: PartialWithId<BrandDoc>) {
    const { search } = this.context.services
    const { brands } = search

    return brands
      .updateDocument(brand)
      .map(() => brand)
  }
}