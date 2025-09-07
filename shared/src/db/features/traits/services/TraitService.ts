import { type DataSources } from '@src/datasources'
import { TraitTypeService } from './TraitTypeService'
import { TraitOptionService } from './TraitOptionService'
import { TraitVoteService } from './TraitVoteService'

export class TraitService {
  types: TraitTypeService
  options: TraitOptionService
  votes: TraitVoteService

  constructor (sources: DataSources) {
    this.types = new TraitTypeService(sources)
    this.options = new TraitOptionService(sources)
    this.votes = new TraitVoteService(sources)
  }
}
