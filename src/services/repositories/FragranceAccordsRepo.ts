import { type DB } from '@src/db/schema'
import { sql, type Selectable } from 'kysely'
import { type MyVote, TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type ParsedPaginationInput } from '@src/factories/PagiFactory'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'

export interface FragranceAccordRow extends Selectable<DB['fragranceAccords']>, MyVote {
  accordId: number
  name: string
  color: string
}

class FillerAccordsRepo extends TableService<'accords', FragranceAccordRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'accords')
  }

  fill (
    fragranceId: number,
    pagination?: ParsedPaginationInput
  ): ResultAsync<FragranceAccordRow[], ApiError> {
    let query = this
      .sources
      .db
      .selectFrom('accords')
      .leftJoin('fragranceAccords', join =>
        join
          .onRef('fragranceAccords.accordId', '=', 'accords.id')
          .on('fragranceAccords.fragranceId', '=', fragranceId)
      )
      .where('fragranceAccords.id', 'is', null)
      .selectAll('accords')
      .select([
        'accords.id as accordId',
        sql<number>`${fragranceId}`.as('fragranceId'),
        sql<number>`0`.as('dislikesCount'),
        sql<number>`0`.as('likesCount'),
        sql<number>`0`.as('voteScore'),
        sql<number | null>`0`.as('myVote')
      ])

    if (pagination != null) {
      query = this
        .Table
        .paginatedQuery(pagination, query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error)
      )
  }
}

export class FragranceAccordsRepo extends TableService<'fragranceAccords', FragranceAccordRow> {
  fillers: FillerAccordsRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceAccords')

    this.fillers = new FillerAccordsRepo(sources)

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        return sources
          .db
          .selectFrom('fragranceAccords')
          .innerJoin('accords', 'accords.id', 'fragranceAccords.accordId')
          .leftJoin('fragrances', 'fragrances.id', 'fragranceAccords.fragranceId')
          .leftJoin('fragranceAccordVotes as av', join =>
            join
              .onRef('av.fragranceAccordId', '=', 'fragranceAccords.id')
              .on('av.userId', '=', userId)
              .on('av.deletedAt', 'is', null)
          )
          .selectAll('fragranceAccords')
          .select([
            'av.vote as myVote',
            'accords.id as accordId',
            'accords.name',
            'accords.color'
          ])
      })
  }
}
