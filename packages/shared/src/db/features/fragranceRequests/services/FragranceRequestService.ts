import { type DataSources } from '@src/datasources/index.js'
import { type FragranceRequestRow } from '@src/db/index.js'
import { FragranceRequestImageService } from './FragranceRequestImageService.js'
import { FragranceRequestAccordService } from './FragranceRequestAccordService.js'
import { FragranceRequestNoteService } from './FragranceRequestNoteService.js'
import { FragranceRequestTraitService } from './FragranceRequestTraitService.js'
import { FragranceRequestVoteService } from './FragranceRequestVoteService.js'
import { TableService } from '@src/db/services/TableService.js'

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
