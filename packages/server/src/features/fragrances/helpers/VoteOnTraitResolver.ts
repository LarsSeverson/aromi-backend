import { type BackendError, unwrapOrThrow, type FragranceTraitVoteRow, type TraitOptionRow } from '@aromi/shared'
import type { MutationResolvers, TraitVote } from '@src/graphql/gql-types.js'
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
      .map(row => this.mapToOutput(row))
  }

  private mapToOutput (row: TraitOptionRow | null): TraitVote | null {
    if (row == null) return null

    return {
      option: row
    }
  }

  private async handleVote () {
    const existingVote = await unwrapOrThrow(this.getExistingVote())

    await unwrapOrThrow(this.upsertVote(existingVote))

    const optionRow = await unwrapOrThrow(this.getOptionRow(existingVote))

    return optionRow
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

  private getOptionRow (existingVote: FragranceTraitVoteRow | null) {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { traitTypeId, traitOptionId } = input
    const { traits } = services

    if (existingVote?.traitOptionId === traitOptionId) return okAsync(null)

    return traits
      .options
      .findOne(eb => eb.and([
        eb('id', '=', traitOptionId),
        eb('traitTypeId', '=', traitTypeId)
      ]))
  }
}