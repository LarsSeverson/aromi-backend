import { TableService } from '@src/server/services/TableService'
import { type DataSources } from '@src/server/datasources'
import { type TraitOptionRow } from '../types'

export class TraitOptionService extends TableService<'traitOptions', TraitOptionRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitOptions')
  }
}
