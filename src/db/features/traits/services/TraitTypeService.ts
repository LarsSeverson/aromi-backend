import { type DataSources } from '@src/datasources'
import { type TraitTypeRow } from '@src/db'
import { TableService } from '@src/db/services/TableService'

export class TraitTypeService extends TableService<'traitTypes', TraitTypeRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitTypes')
  }
}
