import { TableService } from '@src/services/TableService'
import { type FragranceDraftRow } from '../types'
import { type DataSources } from '@src/datasources'
import { FragranceDraftImageService } from './FragranceDraftImageService'
import { type Table } from '@src/services/Table'

export class FragranceDraftService extends TableService<'fragranceDrafts', FragranceDraftRow> {
  images: FragranceDraftImageService

  constructor (sources: DataSources) {
    super(sources, 'fragranceDrafts')

    this.images = new FragranceDraftImageService(sources)
  }

  withConnection (conn: DataSources['db']): Table<'fragranceDrafts', FragranceDraftRow> {
    this.images.withConnection(conn)
    return this.Table.withConnection(conn)
  }
}
