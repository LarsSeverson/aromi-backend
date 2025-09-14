import type { DataSources } from '@src/datasources/index.js'
import { NoteRequestImageService } from './NoteRequestImageService.js'
import { NoteRequestVoteService } from './NoteRequestVoteService.js'
import { FeaturedTableService, type NoteRequestRow } from '@src/db/index.js'

export class NoteRequestService extends FeaturedTableService<NoteRequestRow> {
  images: NoteRequestImageService
  votes: NoteRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'noteRequests')

    this.images = new NoteRequestImageService(sources)
    this.votes = new NoteRequestVoteService(sources)
  }
}
