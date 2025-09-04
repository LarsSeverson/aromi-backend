import { TableService } from '@src/server/services/TableService'
import { type BrandRequestRow } from '../types'
import { type DataSources } from '@src/datasources'
import { BrandRequestImageService } from './BrandRequestImageService'
import { type Table } from '@src/server/services/Table'
import { BrandRequestVoteService } from './BrandRequestVoteService'

export class BrandRequestService extends TableService<'brandRequests', BrandRequestRow> {
  images: BrandRequestImageService
  votes: BrandRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'brandRequests')

    this.images = new BrandRequestImageService(sources)
    this.votes = new BrandRequestVoteService(sources)
  }

  withConnection (conn: DataSources['db']): Table<'brandRequests', BrandRequestRow> {
    this.images.withConnection(conn)
    this.votes.withConnection(conn)

    return this.Table.withConnection(conn)
  }
}
