import { AccordRequestService, AccordService, AssetService, BrandRequestService, BrandService, type DataSources, FragranceRequestService, FragranceService, NoteRequestService, NoteService, SearchServices } from '@aromi/shared'

export class JobServices {
  assets: AssetService

  fragrances: FragranceService
  brands: BrandService
  accords: AccordService
  notes: NoteService

  fragranceRequests: FragranceRequestService
  brandRequests: BrandRequestService
  accordRequests: AccordRequestService
  noteRequests: NoteRequestService

  search: SearchServices

  constructor (sources: DataSources) {
    this.assets = new AssetService(sources)

    this.fragrances = new FragranceService(sources)
    this.brands = new BrandService(sources)
    this.accords = new AccordService(sources)
    this.notes = new NoteService(sources)

    this.fragranceRequests = new FragranceRequestService(sources)
    this.brandRequests = new BrandRequestService(sources)
    this.accordRequests = new AccordRequestService(sources)
    this.noteRequests = new NoteRequestService(sources)

    this.search = new SearchServices(sources)
  }
}
