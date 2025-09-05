import { type DataSources } from '@src/datasources'
import { AccordSearchService } from '../features/accords/services/AccordSearchService'
import { NoteSearchService } from '../features/notes/services/NoteSearchService'
import { BrandSearchService } from '../features/brands/services/BrandSearchService'

export class SearchServices {
  brands: BrandSearchService
  accords: AccordSearchService
  notes: NoteSearchService

  constructor (sources: DataSources) {
    this.brands = new BrandSearchService(sources)
    this.accords = new AccordSearchService(sources)
    this.notes = new NoteSearchService(sources)
  }
}
