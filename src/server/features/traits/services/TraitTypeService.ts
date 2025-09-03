import { TableService } from '@src/server/services/TableService'
import { type DataSources } from '@src/server/datasources'
import { type TraitTypeRow } from '../types'

export class TraitTypeService extends TableService<'traitTypes', TraitTypeRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitTypes')
  }
}
