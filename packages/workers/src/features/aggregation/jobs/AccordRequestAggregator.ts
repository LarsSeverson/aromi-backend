import { PROMOTION_SCORE_THRESHOLD, type AccordRequestRow, PROMOTION_JOB_NAMES, RequestStatus, unwrapOrThrow, type AccordRequestScoreRow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_REQUEST_VOTES

export class AccordRequestAggregator extends BaseAggregator<AggregationJobPayload[JobKey], AccordRequestScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<AccordRequestScoreRow> {
    const { requestId } = job.data

    const request = await unwrapOrThrow(this.getRequest(requestId))
    await unwrapOrThrow(this.getScore(requestId))
    const score = await unwrapOrThrow(this.updateScore(requestId))

    if (this.shouldEnqueuePromotion(request, score)) {
      await this.enqueuePromotion(score)
    }

    return score
  }

  private enqueuePromotion (score: AccordRequestScoreRow) {
    const { queues } = this.context
    const { promotions } = queues

    return promotions
      .enqueue({
        jobName: PROMOTION_JOB_NAMES.PROMOTE_ACCORD,
        data: { requestId: score.requestId }
      })
  }

  private getRequest (requestId: string) {
    const { services } = this.context
    const { accords } = services

    return accords
      .requests
      .findOne(eb => eb('id', '=', requestId))
  }

  private getScore (requestId: string) {
    const { services } = this.context
    const { accords } = services
    const { requests } = accords

    return requests
      .scores
      .findOrCreate(
        eb => eb('requestId', '=', requestId),
        { requestId }
      )
  }

  private updateScore (requestId: string) {
    const { services } = this.context
    const { accords } = services
    const { requests } = accords

    return requests
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

  private shouldEnqueuePromotion (
    request: AccordRequestRow,
    score: AccordRequestScoreRow
  ) {
    return (
      request.requestStatus === RequestStatus.PENDING &&
      score.score >= PROMOTION_SCORE_THRESHOLD
    )
  }
}