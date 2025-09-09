import type { DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'
import type { FragranceTraitRow } from '../types.js'
import { TraitVoteService } from '../../traits/services/TraitVoteService.js'

export class FragranceTraitService extends TableService<'fragranceTraits', FragranceTraitRow> {
  votes: TraitVoteService

  constructor (sources: DataSources) {
    super(sources, 'fragranceTraits')

    this.votes = new TraitVoteService(sources)
  }
}
