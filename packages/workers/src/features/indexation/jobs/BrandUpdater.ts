import { type BrandIndex, type INDEXATION_JOB_NAMES, type IndexationJobPayload, type PartialWithId, unwrapOrThrow } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_BRAND

export class BrandUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PartialWithId<BrandIndex>> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PartialWithId<BrandIndex>> {
    const brand = job.data

    const doc = await unwrapOrThrow(this.updateBrand(brand))

    return doc
  }

  updateBrand (brand: PartialWithId<BrandIndex>) {
    const { search } = this.context.services
    const { brands } = search

    return brands
      .updateDocument(brand)
      .map(() => brand)
  }
}