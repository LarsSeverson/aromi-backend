import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import { BaseAggregator } from './BaseAggregator.js'
import { type BrandRequestScoreRow, unwrapOrThrow } from '@aromi/shared'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_REQUEST_VOTES

export class BrandRequestAggregator extends BaseAggregator<AggregationJobPayload[JobKey], BrandRequestScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<BrandRequestScoreRow> {
    const { requestId } = job.data

    const scoreRow = await unwrapOrThrow(this.handleUpdateRow(requestId))

    return scoreRow
  }

  handleUpdateRow (
    requestId: string
  ) {
    const { services } = this.context
    const { brands } = services
    const { requests } = brands

    return requests
      .votes
      .scores
      .updateOne(
        eb => eb('requestId', '=', requestId),
        eb => ({
          upvotes: eb
            .selectFrom('brandRequestVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('brandRequestVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('brandRequestVotes.requestId', '=', requestId),
          downvotes: eb
            .selectFrom('brandRequestVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('brandRequestVotes.vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('brandRequestVotes.requestId', '=', requestId),
          updatedAt: new Date().toISOString()
        })
      )
  }
}