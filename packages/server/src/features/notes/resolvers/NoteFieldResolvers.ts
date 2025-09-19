import { BackendError, throwError } from '@aromi/shared'
import type { NoteResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { ResultAsync } from 'neverthrow'

export class NoteFieldResolvers extends BaseResolver<NoteResolvers> {
  thumbnail: NoteResolvers['thumbnail'] = async (
    note,
    args,
    context,
    info
  ) => {
    const { id } = note
    const { loaders, services } = context

    const { notes } = loaders
    const { assets } = services

    return await ResultAsync
      .fromPromise(
        notes
          .getThumbnailLoader()
          .load(id),
        error => BackendError.fromDatabase(error)
      )
      .match(
        row => {
          if (row == null) return null
          return assets.getCdnUrl(row.s3Key)
        },
        throwError
      )
  }

  getResolvers (): NoteResolvers {
    return {
      thumbnail: this.thumbnail
    }
  }
}