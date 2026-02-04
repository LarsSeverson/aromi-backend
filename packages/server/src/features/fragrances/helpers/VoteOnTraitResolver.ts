import { type BackendError, unwrapOrThrow } from '@aromi/shared'
import { DBTraitToGQLTrait } from '@src/features/traits/utils/mappers.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
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
      .map(({ traitRow, optionRow, fragranceId }) => ({
        id: `${traitRow.id}:${fragranceId}`,
        type: DBTraitToGQLTrait[traitRow.name],
        option: optionRow
      }))
  }

  private async handleVote () {
    const { args } = this
    const { input } = args

    const { fragranceId, traitTypeId, traitOptionId } = input
    const shouldDeleteVote = traitOptionId == null

    if (shouldDeleteVote) await unwrapOrThrow(this.deleteExistingVote())
    else await unwrapOrThrow(this.upsertVote(traitOptionId))

    const traitRow = await unwrapOrThrow(this.getTraitRow(traitTypeId))
    const optionRow = await unwrapOrThrow(this.getOptionRow())

    return { traitRow, optionRow, fragranceId }
  }

  private upsertVote (traitOptionId: string) {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, traitTypeId } = input
    const { fragrances } = services
    const userId = me.id

    return fragrances
      .traitVotes
      .upsert(
        { fragranceId, userId, traitTypeId, traitOptionId },
        oc => oc
          .columns(['fragranceId', 'userId', 'traitTypeId'])
          .doUpdateSet({ traitOptionId, deletedAt: null })
      )
  }

  private getOptionRow () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { traitTypeId, traitOptionId } = input
    const { traits } = services

    if (traitOptionId == null) return okAsync(null)

    return traits
      .options
      .findOne(eb => eb.and([
        eb('id', '=', traitOptionId),
        eb('traitTypeId', '=', traitTypeId)
      ]))
  }

  private getTraitRow (traitTypeId: string) {
    const { context } = this
    const { services } = context
    const { traits } = services

    return traits
      .types
      .findOne(eb => eb('id', '=', traitTypeId))
  }

  private getExistingVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, traitTypeId } = input
    const { fragrances } = services
    const userId = me.id

    return fragrances
      .traitVotes
      .findOne(
        where => where.and([
          where('fragranceId', '=', fragranceId),
          where('userId', '=', userId),
          where('traitTypeId', '=', traitTypeId)
        ])
      )
  }

  private deleteExistingVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, traitTypeId } = input
    const { fragrances } = services
    const userId = me.id

    return fragrances
      .traitVotes
      .softDeleteOne(
        where => where.and([
          where('fragranceId', '=', fragranceId),
          where('userId', '=', userId),
          where('traitTypeId', '=', traitTypeId)
        ])
      )
  }
}