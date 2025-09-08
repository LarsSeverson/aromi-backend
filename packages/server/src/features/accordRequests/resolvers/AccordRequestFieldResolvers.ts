import { ApiError, throwError } from '@aromi/shared'
import { type AccordRequestResolvers } from '@src/graphql/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { ResultAsync } from 'neverthrow'
import { mapAccordRequestImageRowToAccordImage } from '../utils/mappers'
import { mapVoteInfoRowToVoteInfo } from '@src/utils/mappers'

export class AccordRequestFieldResolvers extends BaseResolver<AccordRequestResolvers> {
  image: AccordRequestResolvers['image'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services, loaders } = context

    const { accordRequests } = loaders
    const { assets } = services

    return await ResultAsync
      .fromPromise(
        accordRequests
          .getImageLoader()
          .load(id),
        error => ApiError.fromDatabase(error)
      )
      .match(
        row => {
          if (row == null) return null

          const image = mapAccordRequestImageRowToAccordImage(row)
          image.url = assets.getCdnUrl(row.s3Key)

          return image
        },
        throwError
      )
  }

  votes: AccordRequestResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, loaders } = context

    const { accordRequests } = loaders

    return await ResultAsync
      .fromPromise(
        accordRequests
          .getVotesLoader(me?.id)
          .load(id),
        error => ApiError.fromDatabase(error)
      )
      .match(
        mapVoteInfoRowToVoteInfo,
        throwError
      )
  }

  getResolvers (): AccordRequestResolvers {
    return {
      image: this.image,
      votes: this.votes
    }
  }
}
