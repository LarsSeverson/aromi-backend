import { type DB } from '@src/db/schema'
import { type ExpressionOrFactory, type SqlBool, type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type ExtendInsertFn } from '@src/db/Table'

export type FragranceCollectionRow = Selectable<DB['fragranceCollections']>

export class FragranceCollectionRepo extends TableService<'fragranceCollections', FragranceCollectionRow> {
  items: FragranceCollectionItemRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceCollections')

    this.items = new FragranceCollectionItemRepo(sources)
  }
}

export type FragranceCollectionItemRow = Selectable<DB['fragranceCollectionItems']>

export class FragranceCollectionItemRepo extends TableService<'fragranceCollectionItems', FragranceCollectionItemRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceCollectionItems')
  }

  create (
    values: FragranceCollectionItemRepoCreateValues,
    extend?: ExtendInsertFn<'fragranceCollectionItems', FragranceCollectionItemRow>
  ): ResultAsync<FragranceCollectionItemRow, ApiError> {
    const { collectionId } = values
    return this
      .getMaxRank(
        eb => eb('collectionId', '=', collectionId)
      )
      .orElse(error => {
        if (error.code === 'INVALID_OUTPUT') {
          return okAsync(0)
        }
        return errAsync(error)
      })
      .andThen(maxRank => {
        const nextRank = maxRank + 1
        return super
          .create(
            {
              ...values,
              rank: String(nextRank)
            },
            extend
          )
      })
  }

  private getMaxRank (
    where: ExpressionOrFactory<DB, 'fragranceCollectionItems', SqlBool>
  ): ResultAsync<number, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .sources
          .db
          .selectFrom('fragranceCollectionItems')
          .where(where)
          .select(
            this.sources.db.fn.max('rank').as('maxRank')
          )
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
      .andThen(row => {
        const maxRank = parseFloat(row.maxRank)
        if (isNaN(maxRank)) {
          return errAsync(
            new ApiError(
              'INVALID_OUTPUT',
              'maxRank returned was not a valid number',
              400
            ))
        }

        return okAsync(maxRank)
      })
  }
}

export type FragranceCollectionItemRepoCreateValues = Partial<FragranceCollectionItemRow> & Pick<FragranceCollectionItemRow, 'collectionId' | 'fragranceId'>
