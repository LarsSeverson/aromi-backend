import type { DataSources } from '@src/datasources/index.js'
import type { CombinedTraitRow2, DB, TraitTypeRow } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { BackendError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'

export class TraitTypeService extends TableService<TraitTypeRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitTypes')
  }

  findTraits (
    where?: ExpressionOrFactory<DB, 'traitTypes' | 'traitOptions', SqlBool>
  ): ResultAsync<CombinedTraitRow2[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('traitOptions', 'traitOptions.traitTypeId', 'traitTypes.id')
      .selectAll('traitTypes')
      .select([
        'traitOptions.id as optionId',
        'traitOptions.label as optionLabel',
        'traitOptions.score as optionScore'
      ])

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
