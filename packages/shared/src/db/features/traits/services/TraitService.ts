import { type DataSources } from '@src/datasources/index.js'
import { TraitTypeService } from './TraitTypeService.js'
import { TraitOptionService } from './TraitOptionService.js'
import { TraitVoteService } from './TraitVoteService.js'

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
