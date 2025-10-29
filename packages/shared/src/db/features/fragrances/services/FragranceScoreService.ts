import { TableService } from '@src/db/services/TableService.js'
import type { FragranceScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export class FragranceScoreService extends TableService<FragranceScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceScores')
  }

  async aggregateVotes (fragranceId: string) {
    const score = await unwrapOrThrow(
      this.updateOne(
        where => where('fragranceId', '=', fragranceId),
        eb => ({
          upvotes: eb
            .selectFrom('fragranceVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('fragranceVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('fragranceVotes.fragranceId', '=', fragranceId),
          downvotes: eb
            .selectFrom('fragranceVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('fragranceVotes.vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('fragranceVotes.fragranceId', '=', fragranceId),
          updatedAt: new Date().toISOString()
        })
      )
    )

    return score
  }
}