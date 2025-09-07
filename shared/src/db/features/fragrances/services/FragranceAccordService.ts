import { TableService } from '@src/db/services/TableService'
import { type FragranceAccordRow } from '../types'
import { type DataSources } from '@src/datasources'

export class FragranceAccordService extends TableService<'fragranceAccords', FragranceAccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceAccords')
  }
}
