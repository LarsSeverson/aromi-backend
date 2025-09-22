import { unwrapOrThrow } from '@aromi/shared'
import type { NoteRequestResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'

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

    const score = await unwrapOrThrow(noteRequests.loadScore(id))
    const myVoteRow = await unwrapOrThrow(noteRequests.loadUserVote(id, me?.id))

    const votes = {
      upvotes: score?.upvotes ?? 0,
      downvotes: score?.downvotes ?? 0,
      score: score?.score ?? 0,
      myVote: myVoteRow?.vote
    }

    return votes
  }

  user: NoteRequestResolvers['user'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { userId } = parent
    const { services } = context

    const { users } = services

    const user = await unwrapOrThrow(
      users
        .findOne(eb => eb('id', '=', userId))
    )

    return mapUserRowToUserSummary(user)
  }

  getResolvers (): NoteRequestResolvers {
    return {
      thumbnail: this.thumbnail,
      votes: this.votes,
      user: this.user
    }
  }
}
