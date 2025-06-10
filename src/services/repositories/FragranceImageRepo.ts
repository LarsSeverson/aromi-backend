import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export type FragranceImageRow = Selectable<DB['fragranceImages']>

export class FragranceImagesRepo extends TableService<'fragranceImages', FragranceImageRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceImages')

    this
      .Table
      .setBaseQueryFactory(() => sources
        .db
        .selectFrom('fragranceImages')
        .leftJoin('fragrances', 'fragrances.id', 'fragranceImages.fragranceId')
        .selectAll('fragranceImages')
      )
  }
}
