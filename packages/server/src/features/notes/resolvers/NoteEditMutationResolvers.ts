import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateNoteEditResolver } from '../helpers/CreateNoteEditResolver.js'
import { genImageKey, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import { ReviewNoteEditResolver } from '../helpers/ReviewNoteEditResolver.js'
import { StageNoteEditThumbnailSchema } from '../utils/validation.js'

export class NoteEditMutationResolvers extends BaseResolver<MutationResolvers> {
  createNoteEdit: MutationResolvers['createNoteEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateNoteEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  reviewNoteEdit: MutationResolvers['reviewNoteEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new ReviewNoteEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  stageNoteEditThumbnail: MutationResolvers['stageNoteEditThumbnail'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    this.checkAuthenticated(context)

    const { fileName } = input
    const { contentType, contentSize } = parseOrThrow(StageNoteEditThumbnailSchema, input)

    const { key } = genImageKey('notes', fileName)
    const { assets } = services

    await unwrapOrThrow(
      assets
        .uploads
        .createOne({ name: fileName, s3Key: key, contentType, sizeBytes: String(contentSize) })
    )

    const payload = await unwrapOrThrow(
      assets
        .getPresignedUrl({ key, contentType, maxSizeBytes: contentSize })
    )

    return payload
  }

  getResolvers (): MutationResolvers {
    return {
      createNoteEdit: this.createNoteEdit,
      reviewNoteEdit: this.reviewNoteEdit,
      stageNoteEditThumbnail: this.stageNoteEditThumbnail
    }
  }
}