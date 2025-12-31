import { unwrapOrThrow } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { type AccordRow, BrandService, FragranceService, type LayerNoteRow } from '@src/db/index.js'
import { FragranceSearchService } from '../services/FragranceSearchService.js'

export const syncFragrances = async (sources: DataSources) => {
  const brandService = new BrandService(sources)

  const fragranceService = new FragranceService(sources)
  const fragranceSearch = new FragranceSearchService(sources)

  const fragrances = await unwrapOrThrow(fragranceService.find())
  const brands = await unwrapOrThrow(brandService.find())
  const accords = await unwrapOrThrow(fragranceService.accords.findAccords())
  const notes = await unwrapOrThrow(fragranceService.notes.findNotes())

  const brandMap = new Map(brands.map(brand => [brand.id, brand]))

  const accordsByFragrance = accords.reduce(
    (acc, accord) => {
      if (!acc.has(accord.fragranceId)) acc.set(accord.fragranceId, [])
      acc.get(accord.fragranceId)?.push(accord)

      return acc
    },
    new Map<string, AccordRow[]>()
  )

  const notesByFragrance = notes.reduce(
    (acc, note) => {
      if (!acc.has(note.fragranceId)) acc.set(note.fragranceId, [])
      acc.get(note.fragranceId)?.push(note)

      return acc
    },
    new Map<string, LayerNoteRow[]>()
  )

  const docs = fragrances.map(fragrance => fragranceSearch.fromRow({
    fragrance,
    brand: brandMap.get(fragrance.brandId) ?? null,
    accords: accordsByFragrance.get(fragrance.id) ?? [],
    notes: notesByFragrance.get(fragrance.id) ?? []
  }))

  console.log('\n--- Fragrance Sync ---')
  console.log(`Fetched ${fragrances.length} fragrances from database`)
  console.log(`Indexing ${docs.length} fragrance documents into search index\n`)

  return await unwrapOrThrow(fragranceSearch.addDocuments(docs))
}
