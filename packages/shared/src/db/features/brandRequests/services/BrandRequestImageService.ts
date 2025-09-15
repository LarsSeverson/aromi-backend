import type { DataSources } from '@src/datasources/index.js'
import type { BrandRequestImageRow } from '../types.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class BrandRequestImageService extends FeaturedTableService<BrandRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestImages')
  }
}
