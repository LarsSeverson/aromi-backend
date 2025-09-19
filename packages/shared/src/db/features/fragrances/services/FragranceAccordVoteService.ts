import type { FragranceAccordVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import type { DB } from '@src/db/db-schema.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import { BackendError } from '@src/utils/error.js'
import type { SqlBool, ExpressionOrFactory } from 'kysely'
import { ResultAsync } from 'neverthrow'
import type { AccordRow } from '../../accords/types.js'

export class FragranceAccordVoteService extends FeaturedTableService<FragranceAccordVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceAccordVotes')
  }

  findAccords (
    where?: ExpressionOrFactory<DB, 'fragranceAccordVotes' | 'accords', SqlBool>
  ): ResultAsync<AccordRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('accords', 'accords.id', 'fragranceAccordVotes.accordId')
      .selectAll('accords')
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