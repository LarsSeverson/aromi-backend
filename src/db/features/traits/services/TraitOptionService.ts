import { type DataSources } from '@src/datasources'
import { type TraitOptionRow } from '@src/db'
import { TableService } from '@src/db/services/TableService'

export class TraitOptionService extends TableService<'traitOptions', TraitOptionRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitOptions')
  }
}
