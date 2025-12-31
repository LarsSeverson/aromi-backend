import { TableService } from '@src/db/services/TableService.js'
import type { PostScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export class PostScoreService extends TableService<PostScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'postScores')
  }

  async aggregateVotes (postId: string) {
    const score = await unwrapOrThrow(
      this.updateOne(
        where => where('postId', '=', postId),
        eb => ({
          upvotes: eb
            .selectFrom('postVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('postVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('postVotes.postId', '=', postId),
          downvotes: eb
            .selectFrom('postVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('postVotes.vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('postVotes.postId', '=', postId),
          updatedAt: new Date().toISOString()
        })
      )
    )

    return score
  }
}