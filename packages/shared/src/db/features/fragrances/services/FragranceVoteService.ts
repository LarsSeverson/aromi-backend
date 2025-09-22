import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceVoteService extends FeaturedTableService<FragranceVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceVotes')
  }
}