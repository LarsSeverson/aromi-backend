import { TableService } from '@src/db/services/TableService.js'
import type { PostCommentScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export class PostCommentScoreService extends TableService<PostCommentScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'postCommentScores')
  }

  async aggregateVotes (commentId: string) {
    const score = await unwrapOrThrow(
      this.updateOne(
        (where) => where('commentId', '=', commentId),
        (eb) => ({
          upvotes: eb
            .selectFrom('postCommentVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb
                      .case()
                      .when('postCommentVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('postCommentVotes.commentId', '=', commentId),
          downvotes: eb
            .selectFrom('postCommentVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb
                      .case()
                      .when('postCommentVotes.vote', '=', - 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('postCommentVotes.commentId', '=', commentId),
          updatedAt: new Date().toISOString()
        })
      )
    )

    return score
  }
}