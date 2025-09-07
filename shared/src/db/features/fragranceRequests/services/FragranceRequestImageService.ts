import { type FragranceRequestImageRow } from '@src/db/features/fragranceRequests/types'
import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'

export class FragranceRequestImageService extends TableService<'fragranceRequestImages', FragranceRequestImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestImages')
  }
}
