import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { FragranceCollectionItemRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'

export class FragranceCollectionItemService extends FeaturedTableService<FragranceCollectionItemRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceCollectionItems')
  }

  findFragrances (
    where?: ExpressionOrFactory<DB, 'fragranceCollectionItems' | 'fragrances', SqlBool>
  ) {
    let query = this
      .Table
      .baseQuery
      .innerJoin('fragrances', 'fragrances.id', 'fragranceCollectionItems.fragranceId')
      .selectAll('fragrances')
      .where('fragrances.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }
}