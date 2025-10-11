import { TableService } from '@src/db/services/TableService.js'
import type { FragranceReviewScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export class FragranceReviewScoreService extends TableService<FragranceReviewScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceReviewScores')
  }

  async aggregate (reviewId: string) {
    await unwrapOrThrow(
      this.findOrCreate(
        where => where('reviewId', '=', reviewId),
        { reviewId }
      )
    )

    const score = await unwrapOrThrow(
      this.updateOne(
        where => where('reviewId', '=', reviewId),
        eb => ({
          upvotes: eb
            .selectFrom('fragranceReviewVotes')
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
            .where('fragranceReviewVotes.reviewId', '=', reviewId),
          downvotes: eb
            .selectFrom('fragranceReviewVotes')
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
            .where('fragranceReviewVotes.reviewId', '=', reviewId),
          updatedAt: new Date().toISOString()
        })
      )
    )

    return score
  }
}