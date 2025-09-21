import { unwrapOrThrow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type FragranceRequestScoreRow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REQUEST_VOTES

export class FragranceRequestAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceRequestScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceRequestScoreRow> {
    const { requestId } = job.data

    const scoreRow = await unwrapOrThrow(this.handleUpdateRow(requestId))

    return scoreRow
  }

  handleUpdateRow (
    requestId: string
  ) {
    const { services } = this.context
    const { fragrances } = services
    const { requests } = fragrances

    return requests
      .votes
      .scores
      .updateOne(
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
                      .when('fragranceRequestVotes.vote', '=', 1)
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
                      .when('fragranceRequestVotes.vote', '=', -1)
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
  }
}