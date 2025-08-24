import { TableService } from '@src/services/TableService'
import { type FragranceDraftRow } from '../types'
import { type DataSources } from '@src/datasources'

export class FragranceDraftService extends TableService<'fragranceDrafts', FragranceDraftRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceDrafts')
  }
}
