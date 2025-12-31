import type { DataSources } from '@src/datasources/index.js'
import { BrandService } from '@src/db/index.js'
import { BrandSearchService } from '../services/BrandSearchService.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export const syncBrands = async (sources: DataSources) => {
  const brandService = new BrandService(sources)
  const brandSearch = new BrandSearchService(sources)

  const brands = await unwrapOrThrow(brandService.find())
  const docs = brands.map(brand => brandSearch.fromRow(brand))

  console.log('\n--- Brand Sync ---')
  console.log(`Fetched ${brands.length} brands from database`)
  console.log(`Indexing ${docs.length} brand documents into search index\n`)

  return await unwrapOrThrow(brandSearch.addDocuments(docs))
}
