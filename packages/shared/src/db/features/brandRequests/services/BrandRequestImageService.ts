import type { DataSources } from '@src/datasources/index.js'
import type { BrandRequestImageRow } from '../types.js'
import { TableService } from '@src/db/services/TableService.js'

export class BrandRequestImageService extends TableService<BrandRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestImages')
  }
}
