import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { CreateBrandEditResolver } from '../helpers/CreateBrandEditResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { ReviewBrandEditResolver } from '../helpers/ReviewBrandEditResolver.js'

export class BrandEditMutationResolvers extends BaseResolver<MutationResolvers> {
  createBrandEdit: MutationResolvers['createBrandEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateBrandEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  reviewBrandEdit: MutationResolvers['reviewBrandEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new ReviewBrandEditResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      createBrandEdit: this.createBrandEdit,
      reviewBrandEdit: this.reviewBrandEdit
    }
  }
}