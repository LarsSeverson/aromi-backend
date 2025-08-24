import { TableService } from '@src/services/TableService'
import { type FragranceDraftImageRow } from '../types'
import { type DataSources } from '@src/datasources'

export class FragranceDraftImageService extends TableService<'fragranceDraftImages', FragranceDraftImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceDraftImages')
  }
}
