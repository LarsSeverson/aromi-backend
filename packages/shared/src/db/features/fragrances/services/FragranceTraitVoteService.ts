import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceTraitVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceTraitVoteService extends FeaturedTableService<FragranceTraitVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceTraitVotes')
  }
}