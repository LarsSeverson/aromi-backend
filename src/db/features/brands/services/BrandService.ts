import { type BrandRow } from '@src/db/features/brands/types'
import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'

export class BrandService extends TableService<'brands', BrandRow> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }
}
