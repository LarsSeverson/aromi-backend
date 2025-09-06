import { type DataSources } from '@src/datasources'
import { AccordRequestService, AccordService, BrandRequestService, BrandService, FragranceRequestService, NoteRequestService, NoteService } from '@src/db'

export class WorkerServices {
  brands: BrandService
  accords: AccordService
  notes: NoteService

  fragranceRequests: FragranceRequestService
  brandRequests: BrandRequestService
  accordRequests: AccordRequestService
  noteRequests: NoteRequestService

  constructor (sources: DataSources) {
    this.brands = new BrandService(sources)
    this.accords = new AccordService(sources)
    this.notes = new NoteService(sources)

    this.fragranceRequests = new FragranceRequestService(sources)
    this.brandRequests = new BrandRequestService(sources)
    this.accordRequests = new AccordRequestService(sources)
    this.noteRequests = new NoteRequestService(sources)
  }
}
