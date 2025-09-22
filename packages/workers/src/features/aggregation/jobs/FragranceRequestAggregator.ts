import { type FragranceRequestRow, PROMOTION_SCORE_THRESHOLD, RequestStatus, unwrapOrThrow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type FragranceRequestScoreRow, PROMOTION_JOB_NAMES } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REQUEST_VOTES

export class FragranceRequestAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceRequestScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceRequestScoreRow> {
    const { requestId } = job.data

    const request = await unwrapOrThrow(this.getRequest(requestId))
    await unwrapOrThrow(this.getScore(requestId))
    const score = await unwrapOrThrow(this.updateScore(requestId))

    if (this.shouldEnqueuePromotion(request, score)) {
      await this.enqueuePromotion(score)
    }

    return score
  }

  private enqueuePromotion (score: FragranceRequestScoreRow) {
    const { queues } = this.context
    const { promotions } = queues

    return promotions
      .enqueue({
        jobName: PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE,
        data: { requestId: score.requestId }
      })
  }

  private getRequest (requestId: string) {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .requests
      .findOne(eb => eb('id', '=', requestId))
  }

  private getScore (requestId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { requests } = fragrances

    return requests
      .scores
      .findOrCreate(
        eb => eb('requestId', '=', requestId),
        { requestId }
      )
  }

  private updateScore (requestId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { requests } = fragrances

    return requests
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

  private shouldEnqueuePromotion (
    request: FragranceRequestRow,
    score: FragranceRequestScoreRow
  ) {
    return (
      request.requestStatus === RequestStatus.PENDING &&
      score.score >= PROMOTION_SCORE_THRESHOLD
    )
  }
}