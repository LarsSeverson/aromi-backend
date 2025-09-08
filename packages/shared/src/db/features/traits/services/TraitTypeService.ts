import { type DataSources } from '@src/datasources/index.js'
import { type TraitTypeRow } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'

export class TraitTypeService extends TableService<'traitTypes', TraitTypeRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitTypes')
  }
}
