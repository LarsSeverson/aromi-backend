import { TableService } from '@src/db/services/TableService.js'
import { type FragranceAccordRow } from '../types.js'
import { type DataSources } from '@src/datasources/index.js'

export class FragranceAccordService extends TableService<'fragranceAccords', FragranceAccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceAccords')
  }
}
