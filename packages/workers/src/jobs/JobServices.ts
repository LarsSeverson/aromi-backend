import { type DataSources } from 'shared/src/datasources'
import { AccordRequestService, AccordService, BrandRequestService, BrandService, FragranceRequestService, NoteRequestService, NoteService } from '@src/db'
import { FragranceService } from '@src/db/features/fragrances/services/FragranceService'
import { AssetService } from '@src/features/assets'

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
  }
}
