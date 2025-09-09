import type { DataSources } from '@src/datasources/index.js'
import { NoteRequestImageService } from './NoteRequestImageService.js'
import { NoteRequestVoteService } from './NoteRequestVoteService.js'
import type { NoteRequestRow } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'

export class NoteRequestService extends TableService<'noteRequests', NoteRequestRow> {
  images: NoteRequestImageService
  votes: NoteRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'noteRequests')

    this.images = new NoteRequestImageService(sources)
    this.votes = new NoteRequestVoteService(sources)
  }
}
