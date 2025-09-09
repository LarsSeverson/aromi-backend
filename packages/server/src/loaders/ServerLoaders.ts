import { AccordRequestLoaders } from '@src/features/accordRequests/loaders/AccordRequestLoaders.js'
import { BrandRequestLoaders } from '@src/features/brandRequests/loaders/BrandRequestLoaders.js'
import { FragranceRequestLoaders } from '@src/features/fragranceRequests/loaders/FragranceRequestLoaders.js'
import { NoteRequestLoaders } from '@src/features/noteRequests/loaders/NoteRequestLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'

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
