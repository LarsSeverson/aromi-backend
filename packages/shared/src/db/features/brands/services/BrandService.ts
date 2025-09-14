import type { DataSources } from '@src/datasources/index.js'
import { BrandImageService } from './BrandImageService.js'
import type { BrandRow } from '../types.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class BrandService extends FeaturedTableService<BrandRow> {
  images: BrandImageService

  constructor (sources: DataSources) {
    super(sources, 'brands')

    this.images = new BrandImageService(sources)
  }
}
