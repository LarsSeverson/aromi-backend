import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { PostCommentRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { PostCommentAssetService } from './PostCommentAssetService.js'

export class PostCommentService extends FeaturedTableService<PostCommentRow> {
  assets: PostCommentAssetService

  constructor (sources: DataSources) {
    super(sources, 'postComments')
    this.assets = new PostCommentAssetService(sources)
  }
}