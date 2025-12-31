import type { DataSources } from '@src/datasources/index.js'
import { AccordSearchService } from '../features/accords/services/AccordSearchService.js'
import { NoteSearchService } from '../features/notes/services/NoteSearchService.js'
import { BrandSearchService } from '../features/brands/services/BrandSearchService.js'
import { FragranceSearchService } from '../features/fragrances/services/FragranceSearchService.js'
import { UserSearchService } from '../features/users/index.js'
import { PostSearchService } from '../features/posts/index.js'

export class SearchServices {
  fragrances: FragranceSearchService
  brands: BrandSearchService
  accords: AccordSearchService
  notes: NoteSearchService
  users: UserSearchService
  posts: PostSearchService

  constructor (sources: DataSources) {
    this.fragrances = new FragranceSearchService(sources)
    this.brands = new BrandSearchService(sources)
    this.accords = new AccordSearchService(sources)
    this.notes = new NoteSearchService(sources)
    this.users = new UserSearchService(sources)
    this.posts = new PostSearchService(sources)
  }

  async ensureIndexes () {
    return await Promise.all([
      this.fragrances.ensureIndex(),
      this.brands.ensureIndex(),
      this.accords.ensureIndex(),
      this.notes.ensureIndex(),
      this.users.ensureIndex(),
      this.posts.ensureIndex(),
      this.posts.comments.ensureIndex()
    ])
  }
}
