import { type BrandRow } from '@src/db/features/brands/types'
import { type DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { BrandImageService } from './BrandImageService.js'

export class BrandService extends TableService<'brands', BrandRow> {
  images: BrandImageService

  constructor (sources: DataSources) {
    super(sources, 'brands')

    this.images = new BrandImageService(sources)
  }
}
