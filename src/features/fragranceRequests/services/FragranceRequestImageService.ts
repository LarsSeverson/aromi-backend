import { TableService } from '@src/services/TableService'
import { type FragranceRequestImageRow } from '../types'
import { type DataSources } from '@src/datasources'

export class FragranceRequestImageService extends TableService<'fragranceRequestImages', FragranceRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestImages')
  }
}
