import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { parseOrThrow } from '@aromi/shared'
import { CreateAccordEditSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['createAccordEdit']

export class CreateAccordEditResolver extends MutationResolver<Mutation> {
  resolve () {
    return this.handleCreateAccordEdit()
  }

  private handleCreateAccordEdit () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { accords } = services

    const proposedValues = parseOrThrow(CreateAccordEditSchema, input)
    const userId = me.id
    const values = { ...proposedValues, userId }

    return accords
      .edits
      .createOne(values)
  }
}