import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { PostCommentRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { PostCommentAssetService } from './PostCommentAssetService.js'
import { PostCommentVoteService } from './PostCommentVoteService.js'
import { PostCommentScoreService } from './PostCommentScoreService.js'

export class PostCommentService extends FeaturedTableService<PostCommentRow> {
  assets: PostCommentAssetService
  votes: PostCommentVoteService
  scores: PostCommentScoreService

  constructor (sources: DataSources) {
    super(sources, 'postComments')
    this.assets = new PostCommentAssetService(sources)
    this.votes = new PostCommentVoteService(sources)
    this.scores = new PostCommentScoreService(sources)
  }
}