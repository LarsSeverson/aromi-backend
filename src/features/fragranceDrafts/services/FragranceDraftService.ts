import { TableService } from '@src/services/TableService'
import { type FragranceDraftRow } from '../types'
import { type DataSources } from '@src/datasources'
import { FragranceDraftImageService } from './FragranceDraftImageService'
import { type Table } from '@src/services/Table'
import { FragranceDraftTraitService } from './FragranceDraftTraitService'
import { FragranceDraftAccordService } from './FragranceDraftAccordService'

export class FragranceDraftService extends TableService<'fragranceDrafts', FragranceDraftRow> {
  images: FragranceDraftImageService
  traits: FragranceDraftTraitService
  accords: FragranceDraftAccordService

  constructor (sources: DataSources) {
    super(sources, 'fragranceDrafts')

    this.images = new FragranceDraftImageService(sources)
    this.traits = new FragranceDraftTraitService(sources)
    this.accords = new FragranceDraftAccordService(sources)
  }

  withConnection (conn: DataSources['db']): Table<'fragranceDrafts', FragranceDraftRow> {
    this.images.withConnection(conn)
    this.traits.withConnection(conn)
    this.accords.withConnection(conn)

    return this.Table.withConnection(conn)
  }
}
