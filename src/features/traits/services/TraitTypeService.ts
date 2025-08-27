import { TableService } from '@src/services/TableService'
import { type DataSources } from '@src/datasources'
import { type TraitTypeRow } from '../types'

export class TraitTypeService extends TableService<'traitTypes', TraitTypeRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitTypes')
  }
}
