import { AccordRequestService, AccordService, AssetService, AuthService, BrandRequestService, BrandService, type DataSources, FragranceRequestService, NoteRequestService, NoteService, SearchServices, TraitService, UserService } from '@aromi/shared'

export class ServerServices {
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
