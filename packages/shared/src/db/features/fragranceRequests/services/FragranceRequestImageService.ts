import type { DataSources } from '@src/datasources/index.js'
import type { FragranceRequestImageRow } from '../types.js'
import { TableService } from '@src/db/index.js'

export class FragranceRequestImageService extends TableService<FragranceRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestImages')
  }
}
