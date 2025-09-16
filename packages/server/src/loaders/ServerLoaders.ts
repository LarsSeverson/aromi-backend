import { AccordRequestLoaders } from '@src/features/accordRequests/loaders/AccordRequestLoaders.js'
import { BrandRequestLoaders } from '@src/features/brandRequests/loaders/BrandRequestLoaders.js'
import { BrandLoaders } from '@src/features/brands/loaders/BrandLoaders.js'
import { FragranceRequestLoaders } from '@src/features/fragranceRequests/loaders/FragranceRequestLoaders.js'
import { FragranceLoaders } from '@src/features/fragrances/loaders/FragranceLoaders.js'
import { NoteRequestLoaders } from '@src/features/noteRequests/loaders/NoteRequestLoaders.js'
import { NoteLoaders } from '@src/features/notes/loaders/NoteLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'

export class ServerLoaders {
  fragrances: FragranceLoaders
  brands: BrandLoaders
  notes: NoteLoaders

  fragranceRequests: FragranceRequestLoaders
  brandRequests: BrandRequestLoaders
  accordRequests: AccordRequestLoaders
  noteRequests: NoteRequestLoaders

  constructor (services: ServerServices) {
    this.fragrances = new FragranceLoaders(services)
    this.brands = new BrandLoaders(services)
    this.notes = new NoteLoaders(services)

    this.fragranceRequests = new FragranceRequestLoaders(services)
    this.brandRequests = new BrandRequestLoaders(services)
    this.accordRequests = new AccordRequestLoaders(services)
    this.noteRequests = new NoteRequestLoaders(services)
  }
}
