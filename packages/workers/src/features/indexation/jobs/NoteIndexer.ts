import { type NoteRow, unwrapOrThrow, type INDEXATION_JOB_NAMES, type IndexationJobPayload, type NoteDoc } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_NOTE

export class NoteIndexer extends BaseIndexer<IndexationJobPayload[JobKey], NoteDoc> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<NoteDoc> {
    const { noteId } = job.data

    const row = await unwrapOrThrow(this.getNoteRow(noteId))
    const doc = await unwrapOrThrow(this.addNote(row))

    return doc
  }

  addNote (note: NoteRow) {
    const { search } = this.context.services
    const { notes } = search

    const doc = notes.fromRow(note)

    return search
      .notes
      .addDocument(doc)
      .map(() => doc)
  }

  getNoteRow (noteId: string) {
    const { services } = this.context
    const { notes } = services

    return notes.findOne(eb => eb('id', '=', noteId))
  }
}