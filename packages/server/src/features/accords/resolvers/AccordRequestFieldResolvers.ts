import { unwrapOrThrow } from '@aromi/shared'
import type { AccordRequestResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import { AccordRequestVotesResolver } from '../helpers/AccordRequestVotesResolver.js'

export class AccordRequestFieldResolvers extends BaseResolver<AccordRequestResolvers> {
  thumbnail: AccordRequestResolvers['thumbnail'] = async (
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

  votes: AccordRequestResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new AccordRequestVotesResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  user: AccordRequestResolvers['user'] = async (
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

  getResolvers (): AccordRequestResolvers {
    return {
      votes: this.votes,
      thumbnail: this.thumbnail,
      user: this.user
    }
  }
}
