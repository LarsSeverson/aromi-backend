import { TableService } from '@src/services/TableService'
import { type FragranceDraftRow } from '../types'
import { type DataSources } from '@src/datasources'
import { FragranceDraftImageService } from './FragranceDraftImageService'
import { type Table } from '@src/services/Table'
import { FragranceDraftTraitService } from './FragranceDraftTraitService'

export class FragranceDraftService extends TableService<'fragranceDrafts', FragranceDraftRow> {
  images: FragranceDraftImageService
  traits: FragranceDraftTraitService

  constructor (sources: DataSources) {
    super(sources, 'fragranceDrafts')

    this.images = new FragranceDraftImageService(sources)
    this.traits = new FragranceDraftTraitService(sources)
  }

  withConnection (conn: DataSources['db']): Table<'fragranceDrafts', FragranceDraftRow> {
    this.images.withConnection(conn)
    this.traits.withConnection(conn)

    return this.Table.withConnection(conn)
  }
}
