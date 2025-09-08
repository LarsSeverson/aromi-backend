import { TableService } from '@src/db/services/TableService.js'
import { type FragranceRow } from '../types.js'
import { type DataSources } from '@src/datasources/index.js'
import { FragranceImageService } from './FragranceImageService.js'
import { FragranceTraitService } from './FragranceTraitService.js'
import { FragranceAccordService } from './FragranceAccordService.js'
import { FragranceNoteService } from './FragranceNoteService.js'

export class FragranceService extends TableService<'fragrances', FragranceRow> {
  images: FragranceImageService
  accords: FragranceAccordService
  notes: FragranceNoteService
  traits: FragranceTraitService

  constructor (sources: DataSources) {
    super(sources, 'fragrances')

    this.images = new FragranceImageService(sources)
    this.accords = new FragranceAccordService(sources)
    this.notes = new FragranceNoteService(sources)
    this.traits = new FragranceTraitService(sources)
  }
}
