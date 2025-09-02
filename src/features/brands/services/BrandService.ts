import { TableService } from '@src/services/TableService'
import { type BrandRow } from '../types'
import { type DataSources } from '@src/datasources'

export class BrandService extends TableService<'brands', BrandRow> {
  constructor (sources: DataSources) {
    super(sources, 'brands')
  }
}
