import type { FragranceIndex } from '@aromi/shared/src/search/features/notes/fragrances/types.js'
import { BaseIndexer } from './BaseIndexer.js'
import type { INDEXATION_JOB_NAMES, IndexationJobPayload } from '@aromi/shared/src/queues/services/indexation/types.js'
import type { AccordRow, BackendError, BrandRow, FragranceRow, LayerNoteRow } from '@aromi/shared'
import type { Job } from 'bullmq'
import { okAsync, ResultAsync } from 'neverthrow'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_FRAGRANCE

export class AddFragranceIndexer extends BaseIndexer<IndexationJobPayload[JobKey], FragranceIndex> {
  // index (job: Job<IndexationJobPayload[JobKey]>): ResultAsync<FragranceIndex, BackendError> {
  //   const { fragranceId } = job.data

  //   return this
  //     .withTransaction(trxSyncer =>
  //       trxSyncer
  //         .getFragrance(fragranceId)
  //         .andThen(fragrance => ResultAsync
  //           .combine([
  //             trxSyncer.getBrand(fragrance).orElse(() => okAsync(null)),
  //             trxSyncer.getAccords(fragrance),
  //             trxSyncer.getNotes(fragrance)
  //           ])
  //           .map(([brand, accords, notes]) => ({ fragrance, brand, accords, notes }))
  //         )
  //     )
  //     .andThen(({ fragrance, brand, accords, notes }) =>
  //       this.syncFragrance(fragrance, brand, accords, notes)
  //     )
  // }

  // syncFragrance (
  //   fragrance: FragranceRow,
  //   brand: BrandRow | null,
  //   accords: AccordRow[],
  //   notes: LayerNoteRow[]
  // ): ResultAsync<FragranceIndex, BackendError> {
  //   const { search } = this.context.services

  //   const docBrand = brand != null
  //     ?
  //     {
  //       id: brand.id,
  //       name: brand.name
  //     }
  //     : null

  //   const docAccords = accords.map(({ id, name }) => ({ id, name }))
  //   const docNotes = notes.map(({ id, name, layer }) => ({ id, name, layer }))

  //   const doc = {
  //     ...fragrance,
  //     brand: docBrand,
  //     accords: docAccords,
  //     notes: docNotes
  //   }

  //   return search
  //     .fragrances
  //     .addDocument(doc)
  //     .map(() => doc)
  // }

  // getFragrance (fragranceId: string): ResultAsync<FragranceRow, BackendError> {
  //   const { services } = this.context
  //   const { fragrances } = services

  //   return fragrances
  //     .findOne(
  //       eb => eb('id', '=', fragranceId)
  //     )
  // }

  // getBrand (row: FragranceRow): ResultAsync<BrandRow, BackendError> {
  //   const { services } = this.context
  //   const { brands } = services

  //   return brands
  //     .findOne(
  //       eb => eb('id', '=', row.brandId)
  //     )
  // }

  // getAccords (row: FragranceRow): ResultAsync<AccordRow[], BackendError> {
  //   const { services } = this.context
  //   const { fragrances } = services

  //   return fragrances
  //     .accords
  //     .votes
  //     .findAccords(
  //       eb => eb('fragranceAccordVotes.fragranceId', '=', row.id)
  //     )
  // }

  // getNotes (row: FragranceRow): ResultAsync<LayerNoteRow[], BackendError> {
  //   const { services } = this.context
  //   const { fragrances } = services

  //   return fragrances
  //     .notes
  //     .votes
  //     .findNotes(
  //       eb => eb('fragranceNoteVotes.fragranceId', '=', row.id)
  //     )
  // }
}
