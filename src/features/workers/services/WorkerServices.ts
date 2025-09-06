import { type DataSources } from '@src/datasources'
import { AccordRequestService, AccordService, BrandRequestService, FragranceRequestService, NoteRequestService } from '@src/db'

export class WorkerServices {
  accords: AccordService

  fragranceRequests: FragranceRequestService
  brandRequests: BrandRequestService
  accordRequests: AccordRequestService
  noteRequests: NoteRequestService

  constructor (sources: DataSources) {
    this.accords = new AccordService(sources)

    this.fragranceRequests = new FragranceRequestService(sources)
    this.brandRequests = new BrandRequestService(sources)
    this.accordRequests = new AccordRequestService(sources)
    this.noteRequests = new NoteRequestService(sources)
  }
}
