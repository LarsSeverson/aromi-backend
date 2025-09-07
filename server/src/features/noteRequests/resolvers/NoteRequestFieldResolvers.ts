import { ApiError, throwError } from '@aromi/shared/utils/error'
import { type NoteRequestResolvers } from '@src/graphql/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { ResultAsync } from 'neverthrow'
import { mapNoteRequestImageRowToNoteImage } from '../utils/mappers'
import { mapVoteInfoRowToVoteInfo } from '@src/utils/mappers'

export class NoteRequestFieldResolvers extends BaseResolver<NoteRequestResolvers> {
  image: NoteRequestResolvers['image'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services, loaders } = context

    const { noteRequests } = loaders
    const { assets } = services

    return await ResultAsync
      .fromPromise(
        noteRequests
          .getImageLoader()
          .load(id),
        error => ApiError.fromDatabase(error)
      )
      .match(
        row => {
          if (row == null) return null

          const image = mapNoteRequestImageRowToNoteImage(row)
          image.url = assets.getCdnUrl(row.s3Key)

          return image
        },
        throwError
      )
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
        error => ApiError.fromDatabase(error)
      )
      .match(
        mapVoteInfoRowToVoteInfo,
        throwError
      )
  }

  getResolvers (): NoteRequestResolvers {
    return {
      image: this.image,
      votes: this.votes
    }
  }
}
