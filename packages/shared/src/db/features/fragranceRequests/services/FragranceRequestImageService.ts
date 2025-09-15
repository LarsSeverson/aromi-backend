import type { DataSources } from '@src/datasources/index.js'
import type { FragranceRequestImageRow } from '../types.js'
import { FeaturedTableService } from '@src/db/index.js'

export class FragranceRequestImageService extends FeaturedTableService<FragranceRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestImages')
  }
}
