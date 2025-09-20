import { BackendError, throwError, unwrapOrThrow } from '@aromi/shared'
import type { NoteRequestResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { ResultAsync } from 'neverthrow'
import { mapVoteInfoRowToVoteInfo } from '@src/utils/mappers.js'

export class NoteRequestFieldResolvers extends BaseResolver<NoteRequestResolvers> {
  thumbnail: NoteRequestResolvers['thumbnail'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { assetId } = parent
    if (assetId == null) return null

    const { services } = context
    const { assets } = services

    const asset = await unwrapOrThrow(
      assets
        .uploads
        .findOne(eb => eb('id', '=', assetId))
    )

    return asset
  }

  votes: NoteRequestResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, loaders } = context

    const { noteRequests } = loaders

    return await ResultAsync
      .fromPromise(
        noteRequests
          .getVotesLoader(me?.id)
          .load(id),
        error => BackendError.fromDatabase(error)
      )
      .match(
        mapVoteInfoRowToVoteInfo,
        throwError
      )
  }

  getResolvers (): NoteRequestResolvers {
    return {
      thumbnail: this.thumbnail,
      votes: this.votes
    }
  }
}
