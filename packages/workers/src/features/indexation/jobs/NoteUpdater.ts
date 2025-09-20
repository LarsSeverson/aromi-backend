import { type INDEXATION_JOB_NAMES, type IndexationJobPayload, type NoteIndex, type PartialWithId, unwrapOrThrow } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_NOTE

export class NoteUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PartialWithId<NoteIndex>> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PartialWithId<NoteIndex>> {
    const note = job.data

    const doc = await unwrapOrThrow(this.updateNote(note))

    return doc
  }

  updateNote (note: PartialWithId<NoteIndex>) {
    const { search } = this.context.services
    const { notes } = search

    return notes
      .updateDocument(note)
      .map(() => note)
  }
}