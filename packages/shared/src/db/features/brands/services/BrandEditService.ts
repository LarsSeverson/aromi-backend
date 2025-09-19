import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { BrandEditRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { EditJobService } from '../../edits/services/EditJobService.js'

export class BrandEditService extends FeaturedTableService<BrandEditRow> {
  jobs: EditJobService

  constructor (sources: DataSources) {
    super(sources, 'brandEdits')
    this.jobs = new EditJobService(sources)
  }
}