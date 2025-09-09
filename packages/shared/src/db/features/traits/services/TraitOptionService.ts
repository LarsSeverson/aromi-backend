import type { DataSources } from '@src/datasources/index.js'
import type { TraitOptionRow } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'

export class TraitOptionService extends TableService<'traitOptions', TraitOptionRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitOptions')
  }
}
