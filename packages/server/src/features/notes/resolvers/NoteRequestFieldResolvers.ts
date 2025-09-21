import { unwrapOrThrow } from '@aromi/shared'
import type { NoteRequestResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { NoteRequestVotesResolver } from '../helpers/NoteRequestVotesResolver.js'

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
    const resolver = new NoteRequestVotesResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  getResolvers (): NoteRequestResolvers {
    return {
      thumbnail: this.thumbnail,
      votes: this.votes
    }
  }
}
