import { TableService } from '@src/server/services/TableService'
import { type BrandRow } from '../types'
import { type DataSources } from '@src/server/datasources'

export class BrandService extends TableService<'brands', BrandRow> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }
}
