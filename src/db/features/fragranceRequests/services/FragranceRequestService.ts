import { type DataSources } from '@src/datasources'
import { type FragranceRequestRow } from '@src/db'
import { FragranceRequestImageService } from './FragranceRequestImageService'
import { FragranceRequestAccordService } from './FragranceRequestAccordService'
import { FragranceRequestNoteService } from './FragranceRequestNoteService'
import { FragranceRequestTraitService } from './FragranceRequestTraitService'
import { FragranceRequestVoteService } from './FragranceRequestVoteService'
import { TableService } from '@src/db/services/TableService'

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
}
