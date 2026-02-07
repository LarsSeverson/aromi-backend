import { unwrapOrThrow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type FragranceTraitScoreRow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

interface GetScoreParams {
  fragranceId: string;
  traitId: string;
  optionId: string;
}

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_TRAIT_VOTES

export class FragranceTraitsAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceTraitScoreRow> {

  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceTraitScoreRow> {
    const params = job.data

    await unwrapOrThrow(this.getScore(params))
    const score = await unwrapOrThrow(this.updateScore(params))

    return score
  }

  private getScore (params: GetScoreParams) {
    const { services } = this.context
    const { fragrances } = services
    const { scores } = fragrances.traits

    return scores.findOrCreate(
      where => where.and([
        where('fragranceId', '=', params.fragranceId),
        where('traitId', '=', params.traitId),
        where('optionId', '=', params.optionId)
      ]),
      params
    )
  }

  private updateScore (params: GetScoreParams) {
    const { fragranceId, traitId, optionId } = params
    const { services } = this.context
    const { fragrances } = services
    const { scores } = fragrances.traits

    return scores.updateOne(
      where => where.and([
        where('fragranceId', '=', fragranceId),
        where('traitId', '=', traitId),
        where('optionId', '=', optionId)
      ]),
      eb => ({
        upvotes: eb
          .selectFrom('fragranceTraitVotes')
          .select(eb =>
            eb
              .fn
              .coalesce(
                eb.fn.sum<number>(
                  eb.case()
                    .when('fragranceTraitVotes.deletedAt', 'is', null)
                    .then(1)
                    .else(0)
                    .end()
                ),
                eb.val(0)
              )
              .as('upvotes')
          )
          .where('fragranceTraitVotes.fragranceId', '=', fragranceId)
          .where('fragranceTraitVotes.traitId', '=', traitId)
          .where('fragranceTraitVotes.traitOptionId', '=', optionId),

        updatedAt: new Date().toISOString()
      })
    )
  }
}