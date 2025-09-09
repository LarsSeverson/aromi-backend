import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB, AccordRow, FragranceRequestAccordRow } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'

export class FragranceRequestAccordService extends TableService<'fragranceRequestAccords', FragranceRequestAccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestAccords')
  }

  findAccords (
    where?: ExpressionOrFactory<DB, 'fragranceRequestAccords' | 'accords', SqlBool>
  ): ResultAsync<AccordRow[], ApiError> {
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
        error => ApiError.fromDatabase(error)
      )
  }
}
