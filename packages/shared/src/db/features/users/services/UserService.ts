import type { DataSources } from '@src/datasources/index.js'
import type { UserRow } from '../types.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import { UserImageService } from './UserImageService.js'
import { FragranceCollectionService } from '../../fragrances/index.js'

export class UserService extends FeaturedTableService<UserRow> {
  images: UserImageService
  collections: FragranceCollectionService

  constructor (sources: DataSources) {
    super(sources, 'users')
    this.images = new UserImageService(sources)
    this.collections = new FragranceCollectionService(sources)
  }
}
