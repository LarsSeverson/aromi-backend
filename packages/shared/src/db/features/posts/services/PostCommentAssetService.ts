import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { PostCommentAssetRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class PostCommentAssetService extends FeaturedTableService<PostCommentAssetRow> {
  constructor (sources: DataSources) {
    super(sources, 'postCommentAssets')
  }
}