import { AccordService, AssetService, AuthService, BrandService, type DataSources, FragranceService, NoteService, SearchServices, TraitService, UserService } from '@aromi/shared'

export class ServerServices {
  auth: AuthService
  assets: AssetService

  users: UserService

  fragrances: FragranceService
  brands: BrandService
  traits: TraitService
  accords: AccordService
  notes: NoteService

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

    this.search = new SearchServices(sources)
  }
}
