import { TableService } from '@src/services/TableService'
import { type DataSources } from '@src/datasources'
import { type TraitOptionRow } from '../types'

export class TraitOptionService extends TableService<'traitOptions', TraitOptionRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitOptions')
  }
}
