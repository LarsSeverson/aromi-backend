import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { AccordEditRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { EditJobService } from '../../edits/services/EditJobService.js'

export class AccordEditService extends FeaturedTableService<AccordEditRow> {
  jobs: EditJobService

  constructor (sources: DataSources) {
    super(sources, 'accordEdits')
    this.jobs = new EditJobService(sources)
  }
}