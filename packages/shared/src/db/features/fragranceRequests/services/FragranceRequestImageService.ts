import type { DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'
import type { FragranceRequestImageRow } from '../types.js'

export class FragranceRequestImageService extends TableService<'fragranceRequestImages', FragranceRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestImages')
  }
}
