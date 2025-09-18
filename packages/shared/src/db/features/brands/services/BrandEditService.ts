import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { BrandEditRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class BrandEditService extends FeaturedTableService<BrandEditRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandEdits')
  }
}