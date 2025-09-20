import { type CombinedTraitRow, type FragranceRequestTraitRow, type DB, FeaturedTableService } from '@src/db/index.js'
import type { DataSources } from '@src/datasources/index.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'

export class FragranceRequestTraitService extends FeaturedTableService<FragranceRequestTraitRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestTraits')
  }

  findTraits (
    where?: ExpressionOrFactory<DB, 'fragranceRequestTraits' | 'traitOptions' | 'traitTypes', SqlBool>
  ): ResultAsync<CombinedTraitRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('traitTypes', 'traitTypes.id', 'fragranceRequestTraits.traitTypeId')
      .innerJoin('traitOptions', 'traitOptions.id', 'fragranceRequestTraits.traitOptionId')
      .select([
        'fragranceRequestTraits.id as fragranceRequestTraitId',
        'fragranceRequestTraits.requestId as fragranceRequestId',
        'fragranceRequestTraits.traitTypeId as fragranceRequestTraitTypeId',
        'fragranceRequestTraits.traitOptionId as fragranceRequestTraitOptionId',

        'traitTypes.id as traitTypeId',
        'traitTypes.name as traitTypeName',

        'traitOptions.id as optionId',
        'traitOptions.label as optionLabel',
        'traitOptions.score as optionScore'
      ])
      .where('fragranceRequestTraits.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
      .map(rows => rows
        .map(row => ({
          traitType: {
            id: row.traitTypeId,
            name: row.traitTypeName
          },
          traitOption: {
            id: row.optionId,
            traitTypeId: row.traitTypeId,
            label: row.optionLabel,
            score: row.optionScore
          }
        })))
  }

  findTrait (
    where: ExpressionOrFactory<DB, 'fragranceRequestTraits' | 'traitOptions' | 'traitTypes', SqlBool>
  ): ResultAsync<CombinedTraitRow, BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('traitTypes', 'traitTypes.id', 'fragranceRequestTraits.traitTypeId')
      .innerJoin('traitOptions', 'traitOptions.id', 'fragranceRequestTraits.traitOptionId')
      .select([
        'fragranceRequestTraits.id as fragranceRequestTraitId',
        'fragranceRequestTraits.requestId as fragranceRequestId',
        'fragranceRequestTraits.traitTypeId as fragranceRequestTraitTypeId',
        'fragranceRequestTraits.traitOptionId as fragranceRequestTraitOptionId',

        'traitTypes.id as traitTypeId',
        'traitTypes.name as traitTypeName',

        'traitOptions.id as optionId',
        'traitOptions.label as optionLabel',
        'traitOptions.score as optionScore'
      ])
      .where('fragranceRequestTraits.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query.executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
      )
      .map(row => ({
        traitType: {
          id: row.traitTypeId,
          name: row.traitTypeName
        },
        traitOption: {
          id: row.optionId,
          traitTypeId: row.traitTypeId,
          label: row.optionLabel,
          score: row.optionScore
        }
      }))
  }
}
