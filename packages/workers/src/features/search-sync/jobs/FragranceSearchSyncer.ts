import type { FragranceIndex } from '@aromi/shared/src/search/features/fragrances/types.js'
import { BaseSearchSyncer } from './BaseSearchSyncer.js'
import type { SEARCH_SYNC_JOB_NAMES, SearchSyncJobPayload } from '@aromi/shared/src/queues/services/search-sync/types.js'
import type { AccordRow, BackendError, BrandRow, ExistingNoteRow, FragranceRow } from '@aromi/shared'
import type { Job } from 'bullmq'
import { okAsync, ResultAsync } from 'neverthrow'

type JobKey = typeof SEARCH_SYNC_JOB_NAMES.SYNC_FRAGRANCE

export class FragranceSearchSyncer extends BaseSearchSyncer<SearchSyncJobPayload[JobKey], FragranceIndex> {
  sync (job: Job<SearchSyncJobPayload[JobKey]>): ResultAsync<FragranceIndex, BackendError> {
    const { fragranceId } = job.data

    return this
      .withTransaction(trxSyncer =>
        trxSyncer
          .getFragrance(fragranceId)
          .andThen(fragrance => ResultAsync
            .combine([
              trxSyncer.getBrand(fragrance).orElse(() => okAsync(null)),
              trxSyncer.getAccords(fragrance),
              trxSyncer.getNotes(fragrance)
            ])
            .map(([brand, accords, notes]) => ({ fragrance, brand, accords, notes }))
          )
      )
      .andThen(({ fragrance, brand, accords, notes }) =>
        this.syncFragrance(fragrance, brand, accords, notes)
      )
  }

  syncFragrance (
    fragrance: FragranceRow,
    brand: BrandRow | null,
    accords: AccordRow[],
    notes: ExistingNoteRow[]
  ): ResultAsync<FragranceIndex, BackendError> {
    const { search } = this.context.services

    const docBrand = brand != null
      ?
      {
        id: brand.id,
        name: brand.name
      }
      : null

    const docAccords = accords.map(accord => ({
      id: accord.id,
      name: accord.name
    }))

    const docNotes = notes.map(note => ({
      id: note.id,
      name: note.name,
      layer: note.layer
    }))

    const doc = {
      ...fragrance,
      brand: docBrand,
      accords: docAccords,
      notes: docNotes
    }

    return search
      .fragrances
      .addDocument(doc)
      .map(() => doc)
  }

  getFragrance (fragranceId: string): ResultAsync<FragranceRow, BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .findOne(
        eb => eb('id', '=', fragranceId)
      )
  }

  getBrand (row: FragranceRow): ResultAsync<BrandRow, BackendError> {
    const { services } = this.context
    const { brands } = services

    return brands
      .findOne(
        eb => eb('id', '=', row.brandId)
      )
  }

  getAccords (row: FragranceRow): ResultAsync<AccordRow[], BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .accords
      .findAccords(
        eb => eb('fragranceAccords.fragranceId', '=', row.id)
      )
  }

  getNotes (row: FragranceRow): ResultAsync<ExistingNoteRow[], BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .notes
      .findExisting(
        eb => eb('fragranceNotes.fragranceId', '=', row.id)
      )
  }
}
