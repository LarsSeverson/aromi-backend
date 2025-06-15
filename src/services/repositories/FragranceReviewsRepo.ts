import { TableService, type MyVote } from '../TableService'
import { type Selectable } from 'kysely'
import { type DB } from '@src/db/schema'
import { type ApiDataSources } from '@src/datasources/datasources'

export type FragranceReviewRow = Selectable<DB['fragranceReviews']> & MyVote

export class FragranceReviewsRepo extends TableService<'fragranceReviews', FragranceReviewRow> {
  dist: FragranceReviewsDistRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceReviews')

    this.dist = new FragranceReviewsDistRepo(sources)

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        return sources
          .db
          .selectFrom('fragranceReviews')
          .leftJoin('fragranceReviewVotes as rv', join =>
            join
              .onRef('rv.fragranceReviewId', '=', 'fragranceReviews.id')
              .on('rv.userId', '=', userId)
              .on('rv.deletedAt', 'is', null)
          )
          .selectAll('fragranceReviews')
          .select('rv.vote as myVote')
      })
  }
}

export type FragranceReviewDistRow = Pick<Selectable<DB['fragranceReviews']>, 'fragranceId' | 'rating'> & { count: number }

export class FragranceReviewsDistRepo extends TableService<'fragranceReviews', FragranceReviewDistRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceReviews')

    this
      .Table
      .setBaseQueryFactory(() => sources
        .db
        .selectFrom('fragranceReviews')
        .select([
          'fragranceId',
          'rating',
          sources
            .db
            .fn
            .count<number>('rating')
            .as('count')
        ])
      )
  }
}
