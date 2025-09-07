import { type BrandRow } from '@src/db/features/brands/types'
import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'
import { BrandImageService } from './BrandImageService'

export class BrandService extends TableService<'brands', BrandRow> {
  images: BrandImageService

  constructor (sources: DataSources) {
    super(sources, 'brands')

    this.images = new BrandImageService(sources)
  }
}
