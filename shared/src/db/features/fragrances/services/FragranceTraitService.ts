import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'
import { type FragranceTraitRow } from '../types'
import { TraitVoteService } from '../../traits/services/TraitVoteService'

export class FragranceTraitService extends TableService<'fragranceTraits', FragranceTraitRow> {
  votes: TraitVoteService

  constructor (sources: DataSources) {
    super(sources, 'fragranceTraits')

    this.votes = new TraitVoteService(sources)
  }
}
