import { unwrapOrThrow, type AccordRequestScoreRow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_REQUEST_VOTES

export class AccordRequestAggregator extends BaseAggregator<AggregationJobPayload[JobKey], AccordRequestScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<AccordRequestScoreRow> {
    const { requestId } = job.data

    const scoreRow = await unwrapOrThrow(this.handleUpdateRow(requestId))

    return scoreRow
  }

  handleUpdateRow (
    requestId: string
  ) {
    const { services } = this.context
    const { accords } = services
    const { requests } = accords

    return requests
      .votes
      .scores
      .updateOne(
        eb => eb('requestId', '=', requestId),
        eb => ({
          upvotes: eb
            .selectFrom('accordRequestVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('accordRequestVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('accordRequestVotes.requestId', '=', requestId),
          downvotes: eb
            .selectFrom('accordRequestVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('accordRequestVotes.vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('accordRequestVotes.requestId', '=', requestId),
          updatedAt: new Date().toISOString()
        })
      )
  }
}