import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateNoteEditResolver } from '../helpers/CreateNoteEditResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { ReviewNoteEditResolver } from '../helpers/ReviewNoteEditResolver.js'

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

  getResolvers (): MutationResolvers {
    return {
      createNoteEdit: this.createNoteEdit,
      reviewNoteEdit: this.reviewNoteEdit
    }
  }
}