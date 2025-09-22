import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import { BaseAggregator } from './BaseAggregator.js'
import { PROMOTION_SCORE_THRESHOLD, type BrandRequestRow, type BrandRequestScoreRow, RequestStatus, unwrapOrThrow, PROMOTION_JOB_NAMES } from '@aromi/shared'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_REQUEST_VOTES

export class BrandRequestAggregator extends BaseAggregator<AggregationJobPayload[JobKey], BrandRequestScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<BrandRequestScoreRow> {
    const { requestId } = job.data

    const request = await unwrapOrThrow(this.getRequest(requestId))
    await unwrapOrThrow(this.getScore(requestId))
    const score = await unwrapOrThrow(this.updateScore(requestId))

    if (this.shouldEnqueuePromotion(request, score)) {
      await this.enqueuePromotion(score)
    }

    return score
  }

  private enqueuePromotion (score: BrandRequestScoreRow) {
    const { queues } = this.context
    const { promotions } = queues

    return promotions
      .enqueue({
        jobName: PROMOTION_JOB_NAMES.PROMOTE_BRAND,
        data: { requestId: score.requestId }
      })
  }

  private getRequest (requestId: string) {
    const { services } = this.context
    const { brands } = services

    return brands
      .requests
      .findOne(eb => eb('id', '=', requestId))
  }

  private getScore (requestId: string) {
    const { services } = this.context
    const { brands } = services
    const { requests } = brands

    return requests
      .scores
      .findOrCreate(
        eb => eb('requestId', '=', requestId),
        { requestId }
      )
  }

  private updateScore (requestId: string) {
    const { services } = this.context
    const { brands } = services
    const { requests } = brands

    return requests
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

  private shouldEnqueuePromotion (
    request: BrandRequestRow,
    score: BrandRequestScoreRow
  ) {
    return (
      request.requestStatus === RequestStatus.PENDING &&
      score.score >= PROMOTION_SCORE_THRESHOLD
    )
  }
}