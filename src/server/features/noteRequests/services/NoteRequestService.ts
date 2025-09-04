import { TableService } from '@src/server/services/TableService'
import { type NoteRequestRow } from '../types'
import { type DataSources } from '@src/datasources'
import { NoteRequestImageService } from './NoteRequestImageService'
import { type Table } from '@src/server/services/Table'
import { NoteRequestVoteService } from './NoteRequestVoteService'

export class NoteRequestService extends TableService<'noteRequests', NoteRequestRow> {
  images: NoteRequestImageService
  votes: NoteRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'noteRequests')

    this.images = new NoteRequestImageService(sources)
    this.votes = new NoteRequestVoteService(sources)
  }

  withConnection (conn: DataSources['db']): Table<'noteRequests', NoteRequestRow> {
    this.images.withConnection(conn)
    this.votes.withConnection(conn)

    return this.Table.withConnection(conn)
  }
}
