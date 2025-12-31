import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { PostAssetRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class PostAssetService extends FeaturedTableService<PostAssetRow> {
  constructor (sources: DataSources) {
    super(sources, 'postAssets')
  }
}