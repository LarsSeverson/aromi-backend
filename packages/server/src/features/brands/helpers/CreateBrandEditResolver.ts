import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { parseOrThrow } from '@aromi/shared'
import { CreateBrandEditSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['createBrandEdit']

export class CreateBrandEditResolver extends MutationResolver<Mutation> {
  resolve () {
    return this.handleCreateBrandEdit()
  }

  private handleCreateBrandEdit () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { proposedAvatarId } = input
    const { brands } = services

    const proposedValues = parseOrThrow(CreateBrandEditSchema, input)
    const userId = me.id
    const values = { ...proposedValues, proposedAvatarId, userId }

    return brands
      .edits
      .createOne(values)
  }
}