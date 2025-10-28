import { unwrapOrThrow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type FragranceScoreRow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_VOTES

export class FragranceAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceScoreRow> {
    const { fragranceId } = job.data

    await unwrapOrThrow(this.getScore(fragranceId).orTee(console.log))
    const score = await unwrapOrThrow(this.updateScore(fragranceId).orTee(console.log))

    return score
  }

  private getScore (fragranceId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { scores } = fragrances

    return scores
      .findOrCreate(
        eb => eb('fragranceId', '=', fragranceId),
        { fragranceId }
      )
  }

  private updateScore (fragranceId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { scores } = fragrances

    return scores
      .updateOne(
        eb => eb('fragranceId', '=', fragranceId),
        eb => ({
          upvotes: eb
            .selectFrom('fragranceVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('fragranceVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('fragranceVotes.fragranceId', '=', fragranceId),
          downvotes: eb
            .selectFrom('fragranceVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('fragranceVotes.vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('fragranceVotes.fragranceId', '=', fragranceId),
          updatedAt: new Date().toISOString()
        })
      )
  }
}