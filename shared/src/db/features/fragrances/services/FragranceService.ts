import { TableService } from '@src/db/services/TableService'
import { type FragranceRow } from '../types'
import { type DataSources } from '@src/datasources'
import { FragranceImageService } from './FragranceImageService'
import { FragranceTraitService } from './FragranceTraitService'
import { FragranceAccordService } from './FragranceAccordService'
import { FragranceNoteService } from './FragranceNoteService'

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
