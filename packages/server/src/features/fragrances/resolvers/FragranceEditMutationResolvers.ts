import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateFragranceEditResolver } from '../helpers/CreateFragranceEditResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { ReviewFragranceEditResolver } from '../helpers/ReviewFragranceEditResolver.js'

export class FragranceEditMutationResolvers extends BaseResolver<MutationResolvers> {
  createFragranceEdit: MutationResolvers['createFragranceEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateFragranceEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  reviewFragranceEdit: MutationResolvers['reviewFragranceEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new ReviewFragranceEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      createFragranceEdit: this.createFragranceEdit,
      reviewFragranceEdit: this.reviewFragranceEdit
    }
  }
}