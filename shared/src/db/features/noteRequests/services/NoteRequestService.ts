import { type DataSources } from '@src/datasources'
import { NoteRequestImageService } from './NoteRequestImageService'
import { NoteRequestVoteService } from './NoteRequestVoteService'
import { type NoteRequestRow } from '@src/db'
import { TableService } from '@src/db/services/TableService'

export class NoteRequestService extends TableService<'noteRequests', NoteRequestRow> {
  images: NoteRequestImageService
  votes: NoteRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'noteRequests')

    this.images = new NoteRequestImageService(sources)
    this.votes = new NoteRequestVoteService(sources)
  }
}
