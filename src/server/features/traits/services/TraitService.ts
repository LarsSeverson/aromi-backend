import { type DataSources } from '@src/datasources'
import { ApiService } from '@src/server/services/ApiService'
import { TraitTypeService } from './TraitTypeService'
import { TraitOptionService } from './TraitOptionService'

export class TraitService extends ApiService {
  types: TraitTypeService
  options: TraitOptionService

  constructor (sources: DataSources) {
    super(sources)

    this.types = new TraitTypeService(sources)
    this.options = new TraitOptionService(sources)
  }
}
