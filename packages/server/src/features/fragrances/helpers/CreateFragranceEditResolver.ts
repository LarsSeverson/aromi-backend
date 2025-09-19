import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { CreateFragranceEditSchema } from '../utils/validation.js'
import { parseOrThrow } from '@aromi/shared'

type Mutation = MutationResolvers['createFragranceEdit']

export class CreateFragranceEditResolver extends MutationResolver<Mutation> {
  resolve () {
    return this.handleCreateFragranceEdit()
  }

  private handleCreateFragranceEdit () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { proposedImageId, proposedBrandId } = input
    const { fragrances } = services

    const proposedValues = parseOrThrow(CreateFragranceEditSchema, input)
    const userId = me.id
    const values = { ...proposedValues, proposedImageId, proposedBrandId, userId }

    return fragrances.edits.createOne(values)
  }
}