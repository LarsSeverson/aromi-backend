import { type DataSources } from '@src/datasources'
import { TraitTypeService } from './TraitTypeService'
import { TraitOptionService } from './TraitOptionService'

export class TraitService {
  types: TraitTypeService
  options: TraitOptionService

  constructor (sources: DataSources) {
    this.types = new TraitTypeService(sources)
    this.options = new TraitOptionService(sources)
  }
}
