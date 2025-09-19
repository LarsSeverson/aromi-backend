import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { NoteEditRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { EditJobService } from '../../edits/services/EditJobService.js'

export class NoteEditService extends FeaturedTableService<NoteEditRow> {
  jobs: EditJobService

  constructor (sources: DataSources) {
    super(sources, 'noteEdits')
    this.jobs = new EditJobService(sources)
  }
}