import { unwrapOrThrow, type AccordIndex, type AccordRow, type INDEXATION_JOB_NAMES, type IndexationJobPayload } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_ACCORD

export class AccordIndexer extends BaseIndexer<IndexationJobPayload[JobKey], AccordIndex> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<AccordIndex> {
    const { accordId } = job.data

    const row = await unwrapOrThrow(this.getAccordRow(accordId))
    const doc = await unwrapOrThrow(this.indexAccord(row))

    return doc
  }

  indexAccord (accord: AccordRow) {
    const { search } = this.context.services
    const { accords } = search

    const doc = accords.fromRow(accord)

    return search
      .accords
      .addDocument(doc)
      .map(() => doc)
  }

  getAccordRow (accordId: string) {
    const { services } = this.context
    const { accords } = services

    return accords.findOne(eb => eb('id', '=', accordId))
  }
}