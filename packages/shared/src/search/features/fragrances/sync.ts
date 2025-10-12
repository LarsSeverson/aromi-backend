import { BackendError } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'
import type { FragranceDocAccord, FragranceDocNote } from '@aromi/shared/src/search/features/fragrances/types.js'

export const syncFragrances = (
  meili: DataSources['meili'],
  db: DataSources['db']
) => {
  return ResultAsync
    .fromPromise(
      db
        .selectFrom('fragrances')
        .selectAll()
        .where('fragrances.deletedAt', 'is', null)
        .execute(),
      e => BackendError.fromDatabase(e)
    )
    .andThen(fragrances =>
      ResultAsync
        .combine([
          ResultAsync.fromPromise(
            db
              .selectFrom('brands')
              .select(['id', 'name'])
              .where('deletedAt', 'is', null)
              .execute(),
            e => BackendError.fromDatabase(e)
          ),
          ResultAsync.fromPromise(
            db
              .selectFrom('accords')
              .innerJoin('fragranceAccords', 'accords.id', 'fragranceAccords.accordId')
              .select([
                'fragranceAccords.fragranceId as fragranceId',
                'accords.id as id',
                'accords.name as name'
              ])
              .where('accords.deletedAt', 'is', null)
              .execute(),
            e => BackendError.fromDatabase(e)
          ),
          ResultAsync.fromPromise(
            db
              .selectFrom('notes')
              .innerJoin('fragranceNotes', 'notes.id', 'fragranceNotes.noteId')
              .select([
                'fragranceNotes.fragranceId as fragranceId',
                'notes.id as id',
                'notes.name as name',
                'fragranceNotes.layer as layer'
              ])
              .where('notes.deletedAt', 'is', null)
              .execute(),
            e => BackendError.fromDatabase(e)
          )
        ])
        .map(([brands, accords, notes]) => {
          const brandMap = new Map(brands.map(brand => [brand.id, brand]))

          const accordsByFragrance = accords.reduce(
            (acc, accord) => {
              if (!acc.has(accord.fragranceId)) {
                acc.set(accord.fragranceId, [])
              }

              acc
                .get(accord.fragranceId)
                ?.push({ id: accord.id, name: accord.name })

              return acc
            },
            new Map<string, FragranceDocAccord[]>()
          )

          const notesByFragrance = notes.reduce(
            (acc, note) => {
              if (!acc.has(note.fragranceId)) {
                acc.set(note.fragranceId, [])
              }

              acc
                .get(note.fragranceId)
                ?.push({ id: note.id, name: note.name, layer: note.layer })

              return acc
            },
            new Map<string, FragranceDocNote[]>()
          )

          return fragrances
            .map(fragrance => ({
              ...fragrance,
              brand: fragrance.brandId == null ? null : brandMap.get(fragrance.brandId) ?? null,
              accords: accordsByFragrance.get(fragrance.id) ?? [],
              notes: notesByFragrance.get(fragrance.id) ?? []
            }))
        })
    )
    .andThen(docs =>
      ResultAsync.fromPromise(
        meili
          .client
          .index('fragrances')
          .addDocuments(docs),
        e => BackendError.fromMeili(e)
      )
    )
}
