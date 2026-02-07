import { AGGREGATION_JOB_NAMES, type BackendError, unwrapOrThrow } from '@aromi/shared'
import type { FragranceTraitTypeEnum, MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { okAsync, ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['voteOnFragranceTrait']

export class VoteOnTraitResolver extends MutationResolver<Mutation> {
  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleVote(),
        error => error as BackendError
      )
      .map(({ traitRow, fragranceId }) => ({
        ...traitRow,
        fragranceId,
        type: traitRow.name.toUpperCase() as FragranceTraitTypeEnum
      }))
  }

  private async handleVote () {
    const { args } = this
    const { input } = args
    const { fragranceId, traitId, traitOptionId: newOptionId } = input

    const existingVote = await this.getExistingVote().unwrapOr(undefined)
    const oldOptionId = existingVote?.traitOptionId

    const shouldDeleteVote = newOptionId == null

    shouldDeleteVote
      ? await unwrapOrThrow(this.deleteExistingVote())
      : await unwrapOrThrow(this.upsertVote(newOptionId))

    const traitRow = await unwrapOrThrow(this.getTraitRow(traitId))
    const optionRow = await unwrapOrThrow(this.getOptionRow())

    await unwrapOrThrow(this.enqueueAggregations(oldOptionId, newOptionId ?? undefined))

    return { traitRow, optionRow, fragranceId }
  }

  private enqueueAggregations (oldOptionId?: string, newOptionId?: string) {
    const { context, args } = this
    const { queues } = context
    const { fragranceId, traitId } = args.input

    const optionIds = Array.from(new Set([oldOptionId, newOptionId].filter(id => id != null)))

    return optionIds
      .reduce(
        (batch, optionId) => batch.enqueue({
          jobName: AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_TRAIT_VOTES,
          data: { fragranceId, traitId, optionId }
        }),
        queues.aggregations.batch()
      )
      .run()
  }

  private upsertVote (traitOptionId: string) {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, traitId } = input
    const { fragrances } = services
    const userId = me.id

    return fragrances
      .traits
      .votes
      .upsert(
        { fragranceId, userId, traitId, traitOptionId },
        oc => oc
          .columns(['fragranceId', 'userId', 'traitId'])
          .doUpdateSet({ traitOptionId, deletedAt: null })
      )
  }

  private getOptionRow () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { traitId, traitOptionId } = input
    const { traits } = services

    if (traitOptionId == null) return okAsync(null)

    return traits
      .options
      .findOne(eb => eb.and([
        eb('id', '=', traitOptionId),
        eb('traitTypeId', '=', traitId)
      ]))
  }

  private getTraitRow (traitTypeId: string) {
    const { context } = this
    const { services } = context
    const { traits } = services

    return traits
      .findOne(eb => eb('id', '=', traitTypeId))
  }

  private getExistingVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, traitId } = input
    const { fragrances } = services
    const userId = me.id

    return fragrances
      .traits
      .votes
      .findOne(
        where => where.and([
          where('fragranceId', '=', fragranceId),
          where('userId', '=', userId),
          where('traitId', '=', traitId)
        ])
      )
  }

  private deleteExistingVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, traitId } = input
    const { fragrances } = services
    const userId = me.id

    return fragrances
      .traits
      .votes
      .softDeleteOne(
        where => where.and([
          where('fragranceId', '=', fragranceId),
          where('userId', '=', userId),
          where('traitId', '=', traitId)
        ])
      )
  }
}