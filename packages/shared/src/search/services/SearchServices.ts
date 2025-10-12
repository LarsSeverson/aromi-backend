import type { DataSources } from '@src/datasources/index.js'
import { AccordSearchService } from '../features/accords/services/AccordSearchService.js'
import { NoteSearchService } from '../features/notes/services/NoteSearchService.js'
import { BrandSearchService } from '../features/brands/services/BrandSearchService.js'
import { FragranceSearchService } from '../features/fragrances/services/FragranceSearchService.js'
import { UserSearchService } from '../features/users/index.js'

export class SearchServices {
  fragrances: FragranceSearchService
  brands: BrandSearchService
  accords: AccordSearchService
  notes: NoteSearchService
  users: UserSearchService

  constructor (sources: DataSources) {
    this.fragrances = new FragranceSearchService(sources)
    this.brands = new BrandSearchService(sources)
    this.accords = new AccordSearchService(sources)
    this.notes = new NoteSearchService(sources)
    this.users = new UserSearchService(sources)
  }
}
