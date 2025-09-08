import { type DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { BrandRequestImageRow } from '../types.js'

export class BrandRequestImageService extends TableService<'brandRequestImages', BrandRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestImages')
  }
}
