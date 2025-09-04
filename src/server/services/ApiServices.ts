import type { DataSources } from '@src/datasources'
import { SearchServices } from '@src/search/services/SearchServices'
import { AccordRequestService } from '@src/server/features/accordRequests/services/AccordRequestService'
import { AccordService } from '@src/server/features/accords/services/AccordService'
import { AssetService } from '@src/server/features/assets/services/AssetService'
import { AuthService } from '@src/server/features/auth/services/AuthService'
import { BrandRequestService } from '@src/server/features/brandRequests/services/BrandRequestService'
import { BrandService } from '@src/server/features/brands/services/BrandService'
import { FragranceRequestService } from '@src/server/features/fragranceRequests/services/FragranceRequestService'
import { NoteRequestService } from '@src/server/features/noteRequests/services/NoteRequestService'
import { NoteService } from '@src/server/features/notes/services/NoteService'
import { TraitService } from '@src/server/features/traits/services/TraitService'
import { UserService } from '@src/server/features/users/services/UserService'

export class ApiServices {
  auth: AuthService
  assets: AssetService

  users: UserService

  fragranceRequests: FragranceRequestService
  brandRequests: BrandRequestService
  accordRequests: AccordRequestService
  noteRequests: NoteRequestService

  brands: BrandService
  traits: TraitService
  accords: AccordService
  notes: NoteService

  search: SearchServices

  constructor (sources: DataSources) {
    this.auth = new AuthService(sources)
    this.assets = new AssetService(sources)

    this.users = new UserService(sources)

    this.fragranceRequests = new FragranceRequestService(sources)
    this.brandRequests = new BrandRequestService(sources)
    this.accordRequests = new AccordRequestService(sources)
    this.noteRequests = new NoteRequestService(sources)

    this.brands = new BrandService(sources)
    this.traits = new TraitService(sources)
    this.accords = new AccordService(sources)
    this.notes = new NoteService(sources)

    this.search = new SearchServices(sources)
  }
}
