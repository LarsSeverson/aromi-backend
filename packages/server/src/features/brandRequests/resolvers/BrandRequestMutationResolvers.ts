import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { BrandRequestImageMutationResolvers } from './BrandRequestImageMutationResolvers.js'
import { BrandRequestVoteMutationResolvers } from './BrandRequestVoteMutationResolvers.js'
import { CreateBRResolver } from '../helpers/CreateBRResolver.js'
import { UpdateBRResolver } from '../helpers/UpdateBRResolver.js'
import { DeleteBRResolver } from '../helpers/DeleteBRResolver.js'
import { SubmitBRResolver } from '../helpers/SubmitBRResolver.js'

export class BrandRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly images = new BrandRequestImageMutationResolvers()
  private readonly votes = new BrandRequestVoteMutationResolvers()

  createBrandRequest: MutationResolvers['createBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateBRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  updateBrandRequest: MutationResolvers['updateBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdateBRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  deleteBrandRequest: MutationResolvers['deleteBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeleteBRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  submitBrandRequest: MutationResolvers['submitBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SubmitBRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      ...this.images.getResolvers(),
      ...this.votes.getResolvers(),

      createBrandRequest: this.createBrandRequest,
      updateBrandRequest: this.updateBrandRequest,
      deleteBrandRequest: this.deleteBrandRequest,
      submitBrandRequest: this.submitBrandRequest
    }
  }
}
