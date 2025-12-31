import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { PostVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class PostVoteService extends FeaturedTableService<PostVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'postVotes')
  }
}