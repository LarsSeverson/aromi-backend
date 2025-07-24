import { type ApiDataSources } from '@src/datasources/datasources'
import { TableService } from '../TableService'
import { type FragranceAccordRow } from './FragranceAccordsRepo'
import { type ParsedPaginationInput } from '@src/factories/PaginationFactory'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { sql } from 'kysely'

export class AccordFillersRepo extends TableService<'accords', FragranceAccordRow> {
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
