import { AccordRequestService, AccordService, AssetService, AuthService, BrandRequestService, BrandService, type DataSources, FragranceRequestService, FragranceService, NoteRequestService, NoteService, SearchServices, TraitService, UserService } from '@aromi/shared'

export class ServerServices {
  auth: AuthService
  assets: AssetService

  users: UserService

  fragrances: FragranceService
  brands: BrandService
  traits: TraitService
  accords: AccordService
  notes: NoteService

  fragranceRequests: FragranceRequestService
  brandRequests: BrandRequestService
  accordRequests: AccordRequestService
  noteRequests: NoteRequestService

  search: SearchServices

  constructor (sources: DataSources) {
    this.auth = new AuthService(sources)
    this.assets = new AssetService(sources)

    this.users = new UserService(sources)

    this.fragrances = new FragranceService(sources)
    this.brands = new BrandService(sources)
    this.traits = new TraitService(sources)
    this.accords = new AccordService(sources)
    this.notes = new NoteService(sources)

    this.fragranceRequests = new FragranceRequestService(sources)
    this.brandRequests = new BrandRequestService(sources)
    this.accordRequests = new AccordRequestService(sources)
    this.noteRequests = new NoteRequestService(sources)

    this.search = new SearchServices(sources)
  }
}
