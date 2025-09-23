import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceNoteVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceNoteVoteService extends FeaturedTableService<FragranceNoteVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceNoteVotes')
  }
}