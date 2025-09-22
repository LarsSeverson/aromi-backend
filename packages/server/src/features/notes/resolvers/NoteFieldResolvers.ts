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
    const { id } = note
    const { loaders } = context

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