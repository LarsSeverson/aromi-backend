import { TableService } from '@src/server/services/TableService'
import { type DataSources } from '@src/datasources'
import { type FragranceRequestAccordRow } from '../types'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type ExpressionOrFactory, type SqlBool } from 'kysely'
import { type DB } from '@src/generated/db-schema'
import { type AccordRow } from '@src/db'

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
