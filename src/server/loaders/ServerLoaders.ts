import { AccordRequestLoaders } from '@src/server/features/accordRequests/loaders/AccordRequestLoaders'
import { BrandRequestLoaders } from '@src/server/features/brandRequests/loaders/BrandRequestLoaders'
import { FragranceRequestLoaders } from '@src/server/features/fragranceRequests/loaders/FragranceRequestLoaders'
import { NoteRequestLoaders } from '@src/server/features/noteRequests/loaders/NoteRequestLoaders'
import { type ServerServices } from '@src/server/services/ServerServices'

export class ServerLoaders {
  fragranceRequests: FragranceRequestLoaders
  brandRequests: BrandRequestLoaders
  accordRequests: AccordRequestLoaders
  noteRequests: NoteRequestLoaders

  constructor (services: ServerServices) {
    this.fragranceRequests = new FragranceRequestLoaders(services)
    this.brandRequests = new BrandRequestLoaders(services)
    this.accordRequests = new AccordRequestLoaders(services)
    this.noteRequests = new NoteRequestLoaders(services)
  }
}
