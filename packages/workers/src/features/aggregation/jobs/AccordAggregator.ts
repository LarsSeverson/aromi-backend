import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import { BaseAggregator } from './BaseAggregator.js'
import { INDEXATION_JOB_NAMES, unwrapOrThrow, type FragranceAccordScoreRow } from '@aromi/shared'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES

export class AccordAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceAccordScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceAccordScoreRow> {
    const { fragranceId, accordId } = job.data

    await unwrapOrThrow(this.getScore(fragranceId, accordId))
    const score = await unwrapOrThrow(this.updateScore(fragranceId, accordId))

    await this.enqueueIndex(score)

    return score
  }

  private enqueueIndex (score: FragranceAccordScoreRow) {
    const { queues } = this.context
    const { indexations } = queues

    return indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        data: { fragranceId: score.fragranceId }
      })
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