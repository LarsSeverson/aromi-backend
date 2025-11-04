import { type BackendError, unwrapOrThrow, type FragranceTraitVoteRow } from '@aromi/shared'
import { DBTraitToGQLTrait } from '@src/features/traits/utils/mappers.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['voteOnFragranceTrait']

export class VoteOnTraitResolver extends MutationResolver<Mutation> {
  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleVote(),
        error => error as BackendError
      )
      .map(({ traitRow, optionRow }) => ({
        id: traitRow.id,
        type: DBTraitToGQLTrait[traitRow.name],
        option: optionRow
      }))
  }

  private async handleVote () {
    const existingVote = await unwrapOrThrow(this.getExistingVote())
    const newVote = await unwrapOrThrow(this.upsertVote(existingVote))

    const traitRow = await unwrapOrThrow(this.getTraitRow(newVote.traitTypeId))
    const optionRow = await unwrapOrThrow(this.getOptionRow())

    return { traitRow, optionRow }
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
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('userId', '=', userId),
          eb('traitTypeId', '=', traitTypeId)
        ])
      )
      .orElse(error => {
        if (error.status === 404) return okAsync(null)
        return errAsync(error)
      })
  }

  private upsertVote (existingVote: FragranceTraitVoteRow | null) {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, traitTypeId, traitOptionId } = input
    const { fragrances } = services
    const userId = me.id

    const deletedAt = existingVote?.traitOptionId === traitOptionId
      ? new Date().toISOString()
      : null

    return fragrances
      .traitVotes
      .upsert(
        { fragranceId, userId, traitTypeId, traitOptionId },
        oc => oc
          .columns(['fragranceId', 'userId', 'traitTypeId'])
          .doUpdateSet({ deletedAt, traitOptionId })
      )
  }

  private getOptionRow () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { traitTypeId, traitOptionId } = input
    const { traits } = services

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
}