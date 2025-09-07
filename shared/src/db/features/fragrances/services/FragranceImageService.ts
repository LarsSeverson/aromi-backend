import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'
import { type FragranceImageRow } from '../types'

export class FragranceImageService extends TableService<'fragranceImages', FragranceImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceImages')
  }
}
