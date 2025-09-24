import { TableService } from '@src/db/services/TableService.js'
import type { FragranceRequestScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export class FragranceRequestScoreService extends TableService<FragranceRequestScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestScores')
  }

  async aggregate (requestId: string) {
    await unwrapOrThrow(
      this.findOrCreate(
        eb => eb('requestId', '=', requestId),
        { requestId }
      )
    )

    const score = await unwrapOrThrow(
      this.updateOne(
        eb => eb('requestId', '=', requestId),
        eb => ({
          upvotes: eb
            .selectFrom('fragranceRequestVotes')
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
            .where('fragranceRequestVotes.requestId', '=', requestId),
          downvotes: eb
            .selectFrom('fragranceRequestVotes')
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
            .where('fragranceRequestVotes.requestId', '=', requestId),
          updatedAt: new Date().toISOString()
        })
      )
    )

    return score
  }
}