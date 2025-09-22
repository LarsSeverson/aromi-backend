import { unwrapOrThrow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type BrandScoreRow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_VOTES

export class BrandAggregator extends BaseAggregator<AggregationJobPayload[JobKey], BrandScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<BrandScoreRow> {
    const { brandId } = job.data

    await unwrapOrThrow(this.getScore(brandId))
    const score = await unwrapOrThrow(this.updateScore(brandId))

    return score
  }

  private getScore (brandId: string) {
    const { services } = this.context
    const { brands } = services
    const { scores } = brands

    return scores
      .findOrCreate(
        eb => eb('brandId', '=', brandId),
        { brandId }
      )
  }

  private updateScore (brandId: string) {
    const { services } = this.context
    const { brands } = services
    const { scores } = brands

    return scores
      .updateOne(
        eb => eb('brandId', '=', brandId),
        eb => ({
          upvotes: eb
            .selectFrom('brandVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('brandVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('brandVotes.brandId', '=', brandId),
          downvotes: eb
            .selectFrom('brandVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('brandVotes.vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('brandVotes.brandId', '=', brandId),
          updatedAt: new Date().toISOString()
        })
      )
  }
}