import { TableService } from '@src/services/TableService'
import { type DataSources } from '@src/datasources'
import { type AccordRow } from '@src/features/accords/types'
import { type FragranceDraftAccordRow } from '../types'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type ExpressionOrFactory, type SqlBool } from 'kysely'
import { type DB } from '@src/db/schema'

export class FragranceDraftAccordService extends TableService<'fragranceDraftAccords', FragranceDraftAccordRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceDraftAccords')
  }

  findAccords (
    where?: ExpressionOrFactory<DB, 'fragranceDraftAccords' | 'accords', SqlBool>
  ): ResultAsync<AccordRow[], ApiError> {
    let query = this.Table.baseQuery
      .innerJoin('accords', 'accords.id', 'fragranceDraftAccords.accordId')
      .selectAll('accords')
      .where('fragranceDraftAccords.deletedAt', 'is', null)
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
