import { TableService } from '@src/server/services/TableService'
import { type BrandRequestImageRow } from '../types'
import { type DataSources } from '@src/server/datasources'

export class BrandRequestImageService extends TableService<'brandRequestImages', BrandRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestImages')
  }
}
