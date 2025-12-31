import type { DataSources } from '@src/datasources/index.js'
import { AccordSearchService } from '../services/AccordSearchService.js'
import { AccordService } from '@src/db/index.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export const syncAccords = async (sources: DataSources) => {
  const accordService = new AccordService(sources)
  const accordSearch = new AccordSearchService(sources)

  const accords = await unwrapOrThrow(accordService.find())
  const docs = accords.map(accord => accordSearch.fromRow(accord))

  console.log('\n--- Accord Sync ---')
  console.log(`Fetched ${accords.length} accords from database`)
  console.log(`Indexing ${docs.length} accord documents into search index\n`)

  return await unwrapOrThrow(accordSearch.addDocuments(docs))
}
