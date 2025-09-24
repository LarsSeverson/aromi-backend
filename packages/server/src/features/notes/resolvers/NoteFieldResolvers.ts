import { unwrapOrThrow } from '@aromi/shared'
import type { NoteResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class NoteFieldResolvers extends BaseResolver<NoteResolvers> {
  thumbnail: NoteResolvers['thumbnail'] = async (
    note,
    args,
    context,
    info
  ) => {
    const { id, thumbnailImageId } = note
    const { loaders } = context

    if (thumbnailImageId != null) {
      return await unwrapOrThrow(
        loaders.notes.images.load(thumbnailImageId)
      )
    }

    const thumbnail = await unwrapOrThrow(
      loaders.notes.loadThumbnail(id)
    )

    return thumbnail
  }

  getResolvers (): NoteResolvers {
    return {
      thumbnail: this.thumbnail
    }
  }
}