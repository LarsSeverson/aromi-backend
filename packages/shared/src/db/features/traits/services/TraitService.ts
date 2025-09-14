import type { DataSources } from '@src/datasources/index.js'
import { TraitTypeService } from './TraitTypeService.js'
import { TraitOptionService } from './TraitOptionService.js'

export class TraitService {
  types: TraitTypeService
  options: TraitOptionService

  constructor (sources: DataSources) {
    this.types = new TraitTypeService(sources)
    this.options = new TraitOptionService(sources)
  }
}
