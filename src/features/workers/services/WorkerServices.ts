import { type DataSources } from '@src/datasources'
import { AccordRequestService, BrandRequestService, FragranceRequestService, NoteRequestService } from '@src/db'

export class WorkerServices {
  fragranceRequests: FragranceRequestService
  brandRequests: BrandRequestService
  accordRequests: AccordRequestService
  noteRequests: NoteRequestService

  constructor (sources: DataSources) {
    this.fragranceRequests = new FragranceRequestService(sources)
    this.brandRequests = new BrandRequestService(sources)
    this.accordRequests = new AccordRequestService(sources)
    this.noteRequests = new NoteRequestService(sources)
  }
}
