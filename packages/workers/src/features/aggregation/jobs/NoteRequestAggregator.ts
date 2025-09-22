import { type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type NoteRequestRow, type NoteRequestScoreRow, PROMOTION_JOB_NAMES, PROMOTION_SCORE_THRESHOLD, RequestStatus, unwrapOrThrow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_REQUEST_VOTES

export class NoteRequestAggregator extends BaseAggregator<AggregationJobPayload[JobKey], NoteRequestScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<NoteRequestScoreRow> {
    const { requestId } = job.data

    const request = await unwrapOrThrow(this.getRequest(requestId))
    await unwrapOrThrow(this.getScore(requestId))
    const score = await unwrapOrThrow(this.updateScore(requestId))

    if (this.shouldEnqueuePromotion(request, score)) {
      await this.enqueuePromotion(score)
    }

    return score
  }

  private enqueuePromotion (score: NoteRequestScoreRow) {
    const { queues } = this.context
    const { promotions } = queues

    return promotions
      .enqueue({
        jobName: PROMOTION_JOB_NAMES.PROMOTE_NOTE,
        data: { requestId: score.requestId }
      })
  }

  private getRequest (requestId: string) {
    const { services } = this.context
    const { notes } = services

    return notes
      .requests
      .findOne(eb => eb('id', '=', requestId))
  }

  private getScore (requestId: string) {
    const { services } = this.context
    const { notes } = services
    const { requests } = notes

    return requests
      .scores
      .findOrCreate(
        eb => eb('requestId', '=', requestId),
        { requestId }
      )
  }

  private updateScore (requestId: string) {
    const { services } = this.context
    const { notes } = services
    const { requests } = notes

    return requests
      .scores
      .updateOne(
        eb => eb('requestId', '=', requestId),
        eb => ({
          upvotes: eb
            .selectFrom('noteRequestVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('noteRequestVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('noteRequestVotes.requestId', '=', requestId),
          downvotes: eb
            .selectFrom('noteRequestVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('noteRequestVotes.vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('noteRequestVotes.requestId', '=', requestId),
          updatedAt: new Date().toISOString()
        })
      )
  }

  private shouldEnqueuePromotion (
    request: NoteRequestRow,
    score: NoteRequestScoreRow
  ) {
    return (
      request.requestStatus === RequestStatus.PENDING &&
      score.upvotes >= PROMOTION_SCORE_THRESHOLD
    )
  }
}