import type { DataSources } from '@src/datasources/index.js'
import type { BrandImageRow } from '../types.js'
import { TableService } from '@src/db/services/TableService.js'

export class BrandImageService extends TableService<BrandImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandImages')
  }
}
