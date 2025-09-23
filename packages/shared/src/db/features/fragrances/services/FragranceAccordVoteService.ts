import type { FragranceAccordVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class FragranceAccordVoteService extends FeaturedTableService<FragranceAccordVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceAccordVotes')
  }
}