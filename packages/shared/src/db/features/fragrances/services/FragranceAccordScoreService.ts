import { TableService } from '@src/db/services/TableService.js'
import type { CombinedFragranceAccordScoreRow, FragranceAccordScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import type { ExpressionOrFactory, SelectQueryBuilder, SqlBool, ReferenceExpression } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import type { CursorPaginationInput } from '@src/db/types.js'
import { ResultAsync } from 'neverthrow'
import { BackendError, unwrapOrThrow } from '@src/utils/error.js'

export class FragranceAccordScoreService extends TableService<FragranceAccordScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceAccordScores')
  }

  findAccords (
    where?: ExpressionOrFactory<DB, 'fragranceAccordScores' | 'accords', SqlBool>
  ) {
    let query = this
      .Table
      .baseQuery
      .innerJoin('accords', 'accords.id', 'fragranceAccordScores.accordId')
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

  findCombinedAccords <C>(
    where?: ExpressionOrFactory<DB, 'fragranceAccordScores', SqlBool>,
    pagination?: CursorPaginationInput<C>
  ): ResultAsync<CombinedFragranceAccordScoreRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('accords', 'accords.id', 'fragranceAccordScores.accordId')
      .selectAll('fragranceAccordScores')
      .select([
        'accords.id as id',
        'accords.id as accordId',
        'accords.name as accordName',
        'accords.color as accordColor',
        'accords.description as accordDescription'
      ])
      .where('accords.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    if (pagination != null) {
      query = this.paginatedCombinedAccordsQuery(pagination, query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  private paginatedCombinedAccordsQuery<C, R>(
    input: CursorPaginationInput<C>,
    qb: SelectQueryBuilder<DB, 'fragranceAccordScores' | 'accords', R>
  ) {
    const { first, column, operator, direction, cursor } = input

    const parsedColumn = `fragranceAccordScores.${column}` as ReferenceExpression<DB, 'fragranceAccordScores'>
    const idColumn = 'fragranceAccordScores.accordId'

    return qb
      .$if(cursor.isValid, qb =>
        qb.where(w =>
          w.or([
            w.eb(parsedColumn, operator, cursor.value),
            w.and([
              w.eb(parsedColumn, '=', cursor.value),
              w.eb(idColumn, operator, cursor.lastId)
            ])
          ])
        )
      )
      .orderBy(parsedColumn, direction)
      .orderBy(idColumn, direction)
      .limit(first)
  }

  async aggregate (fragranceId: string, accordId: string) {
    await unwrapOrThrow(
      this.findOrCreate(
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('accordId', '=', accordId)
        ]),
        { fragranceId, accordId }
      )
    )

    const score = await unwrapOrThrow(
      this.updateOne(
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('accordId', '=', accordId)
        ]),
        eb => ({
          upvotes: eb
            .selectFrom('fragranceAccordVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where(eb =>
              eb.and([
                eb('fragranceAccordVotes.fragranceId', '=', fragranceId),
                eb('fragranceAccordVotes.accordId', '=', accordId)
              ])
            ),
          downvotes: eb
            .selectFrom('fragranceAccordVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where(eb =>
              eb.and([
                eb('fragranceAccordVotes.fragranceId', '=', fragranceId),
                eb('fragranceAccordVotes.accordId', '=', accordId)
              ])
            ),
          updatedAt: new Date().toISOString()
        })
      )
    )

    return score
  }
}