import type { FragranceAccordRow } from '../types.js'
import type { DataSources } from '@src/datasources/index.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { ResultAsync } from 'neverthrow'
import type { AccordRow } from '../../accords/types.js'
import { BackendError } from '@src/utils/error.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export class FragranceAccordService extends FeaturedTableService<FragranceAccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceAccords')
  }

  findAccords (
    where?: ExpressionOrFactory<DB, 'fragranceAccords' | 'accords', SqlBool>
  ): ResultAsync<AccordRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('accords', 'accords.id', 'fragranceAccords.accordId')
      .selectAll('accords')
      .where('fragranceAccords.deletedAt', 'is', null)
      .where('accords.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }
}
