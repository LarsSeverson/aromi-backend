import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import { type DB, type AccordRow, type FragranceRequestAccordRow, FeaturedTableService } from '@src/db/index.js'

export class FragranceRequestAccordService extends FeaturedTableService<FragranceRequestAccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestAccords')
  }

  findAccords (
    where?: ExpressionOrFactory<DB, 'fragranceRequestAccords' | 'accords', SqlBool>
  ): ResultAsync<AccordRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('accords', 'accords.id', 'fragranceRequestAccords.accordId')
      .selectAll('accords')
      .where('fragranceRequestAccords.deletedAt', 'is', null)
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
