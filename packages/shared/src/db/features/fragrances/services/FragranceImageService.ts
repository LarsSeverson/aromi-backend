import type { DataSources } from '@src/datasources/index.js'
import type { FragranceImageRow } from '../types.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class FragranceImageService extends FeaturedTableService<FragranceImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceImages')
  }
}
