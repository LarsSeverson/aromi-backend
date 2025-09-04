import { TableService } from '@src/server/services/TableService'
import { type BrandRow } from '@src/db/types'
import { type DataSources } from '@src/datasources'

export class BrandService extends TableService<'brands', BrandRow> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }
}
