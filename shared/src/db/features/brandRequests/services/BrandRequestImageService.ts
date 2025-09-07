import { type BrandRequestImageRow } from '@src/db'
import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'

export class BrandRequestImageService extends TableService<'brandRequestImages', BrandRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestImages')
  }
}
