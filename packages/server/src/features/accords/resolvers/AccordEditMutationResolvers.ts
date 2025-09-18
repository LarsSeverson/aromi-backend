import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateAccordEditResolver } from '../helpers/CreateAccordEditResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { ReviewAccordEditResolver } from '../helpers/ReviewAccordEditResolver.js'

export class AccordEditMutationResolvers extends BaseResolver<MutationResolvers> {
  createAccordEdit: MutationResolvers['createAccordEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateAccordEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  reviewAccordEdit: MutationResolvers['reviewAccordEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new ReviewAccordEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      createAccordEdit: this.createAccordEdit,
      reviewAccordEdit: this.reviewAccordEdit
    }
  }
}