import { AccordRequestLoaders } from '@src/features/accords/loaders/AccordRequestLoaders.js'
import { BrandRequestLoaders } from '@src/features/brands/loaders/BrandRequestLoaders.js'
import { BrandLoaders } from '@src/features/brands/loaders/BrandLoaders.js'
import { FragranceRequestLoaders } from '@src/features/fragrances/loaders/FragranceRequestLoaders.js'
import { FragranceLoaders } from '@src/features/fragrances/loaders/FragranceLoaders.js'
import { NoteRequestLoaders } from '@src/features/notes/loaders/NoteRequestLoaders.js'
import { NoteLoaders } from '@src/features/notes/loaders/NoteLoaders.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import { AssetLoaders } from '@src/features/assets/loaders/AssetLoaders.js'
import { UserLoaders } from '@src/features/users/index.js'
import { PostLoaders } from '@src/features/posts/loaders/PostLoaders.js'

export class ServerLoaders {
  assets: AssetLoaders

  users: UserLoaders

  fragrances: FragranceLoaders
  brands: BrandLoaders
  notes: NoteLoaders
  posts: PostLoaders

  fragranceRequests: FragranceRequestLoaders
  brandRequests: BrandRequestLoaders
  accordRequests: AccordRequestLoaders
  noteRequests: NoteRequestLoaders

  constructor (services: ServerServices) {
    this.assets = new AssetLoaders(services)

    this.users = new UserLoaders(services)

    this.fragrances = new FragranceLoaders(services)
    this.brands = new BrandLoaders(services)
    this.notes = new NoteLoaders(services)
    this.posts = new PostLoaders(services)

    this.fragranceRequests = new FragranceRequestLoaders(services)
    this.brandRequests = new BrandRequestLoaders(services)
    this.accordRequests = new AccordRequestLoaders(services)
    this.noteRequests = new NoteRequestLoaders(services)
  }
}
