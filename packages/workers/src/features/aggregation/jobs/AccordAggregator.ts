import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import { BaseAggregator } from './BaseAggregator.js'
import { unwrapOrThrow, type FragranceAccordScoreRow } from '@aromi/shared'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES

export class AccordAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceAccordScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceAccordScoreRow> {
    const { fragranceId, accordId } = job.data

    await unwrapOrThrow(this.getScore(fragranceId, accordId))
    const score = await unwrapOrThrow(this.updateScore(fragranceId, accordId))

    return score
  }

  private getScore (fragranceId: string, accordId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { accords } = fragrances

    return accords
      .scores
      .findOrCreate(
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('accordId', '=', accordId)
        ]),
        { fragranceId, accordId }
      )
  }

  private updateScore (fragranceId: string, accordId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { accords } = fragrances

    return accords
      .scores
      .updateOne(
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('accordId', '=', accordId)
        ]),
        eb => ({
          upvotes: eb
            .selectFrom('fragranceAccordVotes')
            .select(eb.fn.countAll<number>().as('upvotes'))
            .where('fragranceAccordVotes.fragranceId', '=', fragranceId)
            .where('fragranceAccordVotes.accordId', '=', accordId),
          updatedAt: new Date().toISOString()
        })
      )
  }
}