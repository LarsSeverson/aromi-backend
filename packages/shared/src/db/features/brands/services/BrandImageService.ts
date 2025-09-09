import type { DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'
import type { BrandImageRow } from '../types.js'

export class BrandImageService extends TableService<'brandImages', BrandImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandImages')
  }
}
