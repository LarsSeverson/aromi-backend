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
    const { before, start, length } = params
    const windowStart = Math.max(0, Math.min(start, before))
    const windowEnd = Math.max(start + length, before + 1)

    return ResultAsync
      .fromPromise(
        this
          .sources
          .db
          .selectFrom('fragranceCollectionItems')
          .select(['id', 'rank'])
          .where('collectionId', '=', collectionId)
          .orderBy('rank', 'asc')
          .offset(windowStart)
          .limit(windowEnd - windowStart)
          .execute(),
        error => ApiError.fromDatabase(error)
      )
      .andThen(rows => {
        const moved = rows.slice(start - windowStart, start - windowStart + length)
        const insertIndex = before - windowStart

        const left = rows.at(insertIndex - 1)
        const right = rows.at(insertIndex)

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
        .combine(
          moved
            .map((item, idx) => this
              .update(
                eb => eb('id', '=', item.id),
                { rank: (leftRank + step * (idx + 1)) }
              )
            )
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
}

export type FragranceCollectionItemRepoCreateValues = Partial<FragranceCollectionItemRow> & Pick<FragranceCollectionItemRow, 'collectionId' | 'fragranceId'>

export interface MoveItemParams {
  before: number
  start: number
  length: number
}
