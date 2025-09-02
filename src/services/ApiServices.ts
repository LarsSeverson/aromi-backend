import type { DataSources } from '@src/datasources'
import { AccordRequestService } from '@src/features/accordRequests/services/AccordRequestService'
import { AccordService } from '@src/features/accords/services/AccordService'
import { AssetService } from '@src/features/assets/services/AssetService'
import { AuthService } from '@src/features/auth/services/AuthService'
import { BrandRequestService } from '@src/features/brandRequests/services/BrandRequestService'
import { BrandService } from '@src/features/brands/services/BrandService'
import { FragranceRequestService } from '@src/features/fragranceRequests/services/FragranceRequestService'
import { NoteRequestService } from '@src/features/noteRequests/services/NoteRequestService'
import { NoteService } from '@src/features/notes/services/NoteService'
import { TraitService } from '@src/features/traits/services/TraitService'
import { UserService } from '@src/features/users/services/UserService'

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
  }
}
