import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'
import { type BrandImageRow } from '../types'

export class BrandImageService extends TableService<'brandImages', BrandImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandImages')
  }
}
