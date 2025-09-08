import { type DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { type FragranceImageRow } from '../types.js'

export class FragranceImageService extends TableService<'fragranceImages', FragranceImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceImages')
  }
}
