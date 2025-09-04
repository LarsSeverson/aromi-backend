import { TableService } from '@src/server/services/TableService'
import { type FragranceRequestRow } from '../types'
import { type DataSources } from '@src/datasources'
import { FragranceRequestImageService } from './FragranceRequestImageService'
import { type Table } from '@src/server/services/Table'
import { FragranceRequestTraitService } from './FragranceRequestTraitService'
import { FragranceRequestAccordService } from './FragranceRequestAccordService'
import { FragranceRequestNoteService } from './FragranceRequestNoteService'
import { FragranceRequestVoteService } from './FragranceRequestVoteService'

export class FragranceRequestService extends TableService<'fragranceRequests', FragranceRequestRow> {
  images: FragranceRequestImageService
  traits: FragranceRequestTraitService
  accords: FragranceRequestAccordService
  notes: FragranceRequestNoteService
  votes: FragranceRequestVoteService

  constructor (sources: DataSources) {
    super(sources, 'fragranceRequests')

    this.images = new FragranceRequestImageService(sources)
    this.traits = new FragranceRequestTraitService(sources)
    this.accords = new FragranceRequestAccordService(sources)
    this.notes = new FragranceRequestNoteService(sources)
    this.votes = new FragranceRequestVoteService(sources)
  }

  withConnection (conn: DataSources['db']): Table<'fragranceRequests', FragranceRequestRow> {
    this.images.withConnection(conn)
    this.traits.withConnection(conn)
    this.accords.withConnection(conn)
    this.notes.withConnection(conn)
    this.votes.withConnection(conn)

    return this.Table.withConnection(conn)
  }
}
