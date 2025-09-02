import { TableService } from '@src/services/TableService'
import { type BrandRequestImageRow } from '../types'
import { type DataSources } from '@src/datasources'

export class BrandRequestImageService extends TableService<'brandRequestImages', BrandRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestImages')
  }
}
