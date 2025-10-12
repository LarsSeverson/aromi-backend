import { unwrapOrThrow, type BrandDoc, type BrandRow, type INDEXATION_JOB_NAMES, type IndexationJobPayload } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_BRAND

export class BrandIndexer extends BaseIndexer<IndexationJobPayload[JobKey], BrandRow> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<BrandDoc> {
    const { brandId } = job.data

    const row = await unwrapOrThrow(this.getBrandRow(brandId))
    const doc = await unwrapOrThrow(this.addBrand(row))

    return doc
  }

  addBrand (brand: BrandRow) {
    const { search } = this.context.services
    const { brands } = search

    const doc = brands.fromRow(brand)

    return search
      .brands
      .addDocument(doc)
      .map(() => doc)
  }

  getBrandRow (brandId: string) {
    const { services } = this.context
    const { brands } = services

    return brands.findOne(eb => eb('id', '=', brandId))
  }

}