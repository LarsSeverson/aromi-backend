import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { CreateBrandRequestResolver } from '../helpers/CreateBrandRequestResolver.js'
import { UpdateBrandRequestResolver } from '../helpers/UpdateBrandRequestResolver.js'
import { DeleteBrandRequestResolver } from '../helpers/DeleteBrandRequestResolver.js'
import { SubmitBrandRequestResolver } from '../helpers/SubmitBrandRequestResolver.js'
import { StageBrandRequestAvatarResolver } from '../helpers/StageBrandRequestAvatarResolver.js'
import { VoteOnBrandRequestResolver } from '../helpers/VoteOnBrandRequestRequest.js'

export class BrandRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  createBrandRequest: MutationResolvers['createBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateBrandRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  updateBrandRequest: MutationResolvers['updateBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdateBrandRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  deleteBrandRequest: MutationResolvers['deleteBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeleteBrandRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  submitBrandRequest: MutationResolvers['submitBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SubmitBrandRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  stageBrandRequestAvatar: MutationResolvers['stageBrandRequestAvatar'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new StageBrandRequestAvatarResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  voteOnBrandRequest: MutationResolvers['voteOnBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnBrandRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      createBrandRequest: this.createBrandRequest,
      updateBrandRequest: this.updateBrandRequest,
      deleteBrandRequest: this.deleteBrandRequest,
      submitBrandRequest: this.submitBrandRequest,
      stageBrandRequestAvatar: this.stageBrandRequestAvatar,
      voteOnBrandRequest: this.voteOnBrandRequest
    }
  }
}
