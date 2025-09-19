import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { CreateNoteEditSchema } from '../utils/validation.js'
import { parseOrThrow } from '@aromi/shared'

type Mutation = MutationResolvers['createNoteEdit']

export class CreateNoteEditResolver extends MutationResolver<Mutation> {
  resolve () {
    return this.handleCreateNoteEdit()
  }

  private handleCreateNoteEdit () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { proposedThumbnailId } = input
    const { notes } = services

    const proposedValues = parseOrThrow(CreateNoteEditSchema, input)
    const userId = me.id
    const values = { ...proposedValues, proposedThumbnailId, userId }

    return notes
      .edits
      .createOne(values)
  }
}