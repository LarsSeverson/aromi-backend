import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceEditRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { EditJobService } from '../../edits/services/EditJobService.js'

export class FragranceEditService extends FeaturedTableService<FragranceEditRow> {
  jobs: EditJobService

  constructor (sources: DataSources) {
    super(sources, 'fragranceEdits')
    this.jobs = new EditJobService(sources)
  }
}