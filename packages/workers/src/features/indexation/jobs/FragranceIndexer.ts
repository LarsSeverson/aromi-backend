import type { FragranceIndex } from '@aromi/shared/src/search/features/notes/fragrances/types.js'
import { BaseIndexer } from './BaseIndexer.js'
import type { INDEXATION_JOB_NAMES, IndexationJobPayload } from '@aromi/shared/src/queues/services/indexation/types.js'
import { unwrapOrThrow, type AccordRow, type BackendError, type BrandRow, type FragranceRow, type LayerNoteRow } from '@aromi/shared'
import type { Job } from 'bullmq'
import { okAsync, ResultAsync } from 'neverthrow'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_FRAGRANCE

export class FragranceIndexer extends BaseIndexer<IndexationJobPayload[JobKey], FragranceIndex> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<FragranceIndex> {
    const { services } = this.context
    const { search } = services

    const { fragranceId } = job.data

    const fragrance = await unwrapOrThrow(this.getFragrance(fragranceId))

    const [brand, accords, notes] = await unwrapOrThrow(
      ResultAsync
        .combine([
          this.getBrand(fragrance).orElse(() => okAsync(null)),
          this.getAccords(fragrance),
          this.getNotes(fragrance)
        ])
    )

    const doc = search.fragrances.fromRow({ fragrance, brand, accords, notes })

    await unwrapOrThrow(
      search
        .fragrances
        .addDocument(doc)
    )

    return doc
  }

  private getFragrance (fragranceId: string): ResultAsync<FragranceRow, BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .findOne(
        eb => eb('id', '=', fragranceId)
      )
  }

  private getBrand (row: FragranceRow): ResultAsync<BrandRow, BackendError> {
    const { services } = this.context
    const { brands } = services

    return brands
      .findOne(
        eb => eb('id', '=', row.brandId)
      )
  }

  private getAccords (row: FragranceRow): ResultAsync<AccordRow[], BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .accords
      .votes
      .findAccords(
        eb => eb('fragranceAccordVotes.fragranceId', '=', row.id)
      )
  }

  private getNotes (row: FragranceRow): ResultAsync<LayerNoteRow[], BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .notes
      .votes
      .findNotes(
        eb => eb('fragranceNoteVotes.fragranceId', '=', row.id)
      )
  }
}
