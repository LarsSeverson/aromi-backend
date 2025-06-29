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
        const nextRank = maxRank + 1000
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

  move (
    collectionId: number,
    params: MoveItemParams
  ): ResultAsync<FragranceCollectionItemRow[], ApiError> {
    return ResultAsync
      .combine(
        [
          this.getMoved(collectionId, params),
          this.getSurrounding(collectionId, params)
        ]
      )
      .andThen(([moved, surrounding]) => {
        const isAtStart = params.before === 0

        const left = isAtStart ? null : surrounding.at(0)
        const right = isAtStart ? surrounding.at(0) : surrounding.at(1)

        const leftRank = left == null ? 0 : parseFloat(left.rank)
        const rightRank = right == null ? leftRank + 1000 : parseFloat(right.rank)

        if (isNaN(leftRank) || isNaN(rightRank)) {
          return errAsync(
            new ApiError(
              'INVALID_OUTPUT',
              'leftRank or rightRank are NaN',
              500,
              { leftRank, rightRank }
            )
          )
        }

        const step = (rightRank - leftRank) / (moved.length + 1)

        return okAsync({ moved, leftRank, step })
      })
      .andThen(({ moved, leftRank, step }) => ResultAsync
        .fromPromise(
          this
            .sources
            .db
            .transaction()
            .execute(async trx => {
              this.withConnection(trx)

              const updates = moved
                .map((item, idx) => this
                  .update(
                    eb => eb('id', '=', item.id),
                    { rank: leftRank + step * (idx + 1) }
                  )
                )

              return await ResultAsync
                .combine(updates)
                .match(
                  rows => rows,
                  error => { throw error }
                )
                .finally(() => {
                  this.withConnection(this.sources.db)
                })
            }),
          error => ApiError.fromDatabase(error)
        )
      )
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

  private getMoved (
    collectionId: number,
    params: MoveItemParams
  ): ResultAsync<Array<Pick<FragranceCollectionItemRow, 'id' | 'rank'>>, ApiError> {
    const { start, length } = params
    return ResultAsync
      .fromPromise(
        this
          .sources
          .db
          .selectFrom('fragranceCollectionItems')
          .select(['id', 'rank'])
          .where('collectionId', '=', collectionId)
          .orderBy('rank', 'asc')
          .offset(start)
          .limit(length)
          .execute(),
        error => ApiError.fromDatabase(error)
      )
  }

  private getSurrounding (
    collectionId: number,
    params: MoveItemParams
  ): ResultAsync<Array<Pick<FragranceCollectionItemRow, 'rank'>>, ApiError> {
    const { before } = params
    const insertIndex = Math.max(0, before - 1)
    return ResultAsync
      .fromPromise(
        this
          .sources
          .db
          .selectFrom('fragranceCollectionItems')
          .select(['rank'])
          .where('collectionId', '=', collectionId)
          .orderBy('rank', 'asc')
          .offset(insertIndex)
          .limit(insertIndex > 0 ? 2 : 1)
          .execute(),
        error => ApiError.fromDatabase(error)
      )
      .andThen(surrounding => {
        if (surrounding.length > 0) return okAsync(surrounding)

        return ResultAsync
          .fromPromise(
            this
              .sources
              .db
              .selectFrom('fragranceCollectionItems')
              .select(['rank'])
              .where('collectionId', '=', collectionId)
              .orderBy('rank', 'desc')
              .limit(1)
              .execute(),
            error => ApiError.fromDatabase(error)
          )
      })
  }
}

export type FragranceCollectionItemRepoCreateValues = Partial<FragranceCollectionItemRow> & Pick<FragranceCollectionItemRow, 'collectionId' | 'fragranceId'>

export interface MoveItemParams {
  before: number
  start: number
  length: number
}
