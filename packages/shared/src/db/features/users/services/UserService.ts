import type { DataSources } from '@src/datasources/index.js'
import type { UserRow } from '../types.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class UserService extends FeaturedTableService<UserRow> {
  constructor (sources: DataSources) {
    super(sources, 'users')
  }
}
