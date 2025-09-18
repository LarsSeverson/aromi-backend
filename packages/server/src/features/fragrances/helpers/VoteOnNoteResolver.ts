import { type BackendError, unwrapOrThrow, type FragranceNoteVoteRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { mapGQLNoteLayerToDBNoteLayer } from '../utils/mappers.js'

type Mutation = MutationResolvers['voteOnFragranceNote']

export class VoteOnNoteResolver extends MutationResolver<Mutation> {
  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleVote(),
        error => error as BackendError
      )
  }

  private async handleVote () {
    const existingVote = await unwrapOrThrow(this.getExistingVote())

    await unwrapOrThrow(this.upsertVote(existingVote))

    const note = await unwrapOrThrow(this.getNote())

    return note
  }

  private getExistingVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, noteId } = input
    const { fragrances } = services
    const userId = me.id

    return fragrances
      .notes
      .votes
      .findOne(
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('noteId', '=', noteId),
          eb('userId', '=', userId)
        ])
      )
      .orElse(error => {
        if (error.status === 404) return okAsync(null)
        return errAsync(error)
      })
  }

  private upsertVote (existingVote: FragranceNoteVoteRow | null) {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, noteId, layer } = input
    const { fragrances } = services
    const userId = me.id

    const dbLayer = mapGQLNoteLayerToDBNoteLayer(layer)
    const deletedAt = existingVote?.deletedAt == null
      ? new Date().toISOString()
      : null

    return fragrances
      .notes
      .votes
      .upsert(
        { fragranceId, userId, noteId, layer: dbLayer },
        oc => oc
          .columns(['fragranceId', 'userId', 'noteId', 'layer'])
          .doUpdateSet({ deletedAt })
      )
  }

  private getNote () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { noteId } = input
    const { notes } = services

    return notes
      .findOne(
        eb => eb('id', '=', noteId)
      )
  }
}