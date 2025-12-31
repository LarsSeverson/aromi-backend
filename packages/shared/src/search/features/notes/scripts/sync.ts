import { unwrapOrThrow } from '@src/utils/error.js'
import type { DataSources } from '@src/datasources/index.js'
import { NoteSearchService } from '../services/NoteSearchService.js'
import { NoteService } from '@src/db/index.js'

export const syncNotes = async (sources: DataSources) => {
  const noteService = new NoteService(sources)
  const noteSearch = new NoteSearchService(sources)

  const notes = await unwrapOrThrow(noteService.find())
  const docs = notes.map(note => noteSearch.fromRow(note))

  console.log('\n--- Note Sync ---')
  console.log(`Fetched ${notes.length} notes from database`)
  console.log(`Indexing ${docs.length} note documents into search index\n`)

  return await unwrapOrThrow(noteSearch.addDocuments(docs))
}
