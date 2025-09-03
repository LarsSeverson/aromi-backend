import { TableService } from '@src/server/services/TableService'
import { type AccordRequestRow } from '../types'
import { type DataSources } from '@src/server/datasources'
import { AccordRequestImageService } from './AccordRequestImageService'
import { type Table } from '@src/server/services/Table'
import { AccordRequestVoteService } from './AccordRequestVoteService'

export class AccordRequestService extends TableService<'accordRequests', AccordRequestRow> {
  images: AccordRequestImageService
  votes: AccordRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'accordRequests')

    this.images = new AccordRequestImageService(sources)
    this.votes = new AccordRequestVoteService(sources)
  }

  withConnection (conn: DataSources['db']): Table<'accordRequests', AccordRequestRow> {
    this.images.withConnection(conn)
    this.votes.withConnection(conn)

    return this.Table.withConnection(conn)
  }
}
