import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { PostCommentVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class PostCommentVoteService extends FeaturedTableService<PostCommentVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'postCommentVotes')
  }
}