import type { DataSources } from '@src/datasources/index.js'
import { type DB, TraitOptionService, type TraitRow } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { BackendError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'

export class TraitService extends TableService<TraitRow> {
  options: TraitOptionService

  constructor (sources: DataSources) {
    super(sources, 'traits')
    this.options = new TraitOptionService(sources)
  }

  findOptions (
    where?: ExpressionOrFactory<DB, 'traits', SqlBool>
  ) {
    const db = this.db

    let query = db
      .selectFrom('traits')
      .innerJoinLateral(
        eb => eb
          .selectFrom('traitOptions')
          .selectAll('traitOptions')
          .whereRef('traitOptions.traitTypeId', '=', 'traits.id')
          .orderBy('traitOptions.value', 'asc')
          .as('o'),
        join => join.onTrue()
      )
      .selectAll('o')

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }
}
